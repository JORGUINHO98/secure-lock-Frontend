import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { validateUUID } from '../utils/validators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useKioskMode } from '../hooks/useKioskMode';


const getOrCreateDeviceId = async () => {
  let id = await AsyncStorage.getItem('@secure_lock:device_id');
  if (!id) {
    id = `dispositivo-${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem('@secure_lock:device_id', id);
  }
  return id;
};

const CameraScannerScreen = ({ route, navigation }) => {
  const { roomId } = route?.params || {};
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { activateKioskMode } = useKioskMode();



  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text style={styles.statusText}>{t('scanner.loading_permissions') || "Cargando permisos..."}</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>{t('scanner.permission_needed') || "Necesitamos tu permiso para mostrar la cámara"}</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>{t('scanner.grant_permission') || "Conceder permiso"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    console.log('QR Escaneado:', data);
    let codigoLimpio = data;

    try {
      // Intentamos parsear por si viene en formato JSON
      const parsedData = JSON.parse(data);
      codigoLimpio = parsedData.invite_code || parsedData.code || data;
    } catch (error) {
      // Si no es JSON, verificamos si es un deep link de la app (ej. securelock://sala/UUID)
      if (data.startsWith('securelock://sala/')) {
        // Extraemos la parte después de /sala/ y antes de cualquier query param
        codigoLimpio = data.split('securelock://sala/')[1]?.split('?')[0] || data;
      }
    }

    console.log('[DEBUG] Código procesado:', codigoLimpio);
    console.log('🚀 INICIANDO PROCESO DE VINCULACIÓN');

    try {
      // Validaciones Previas: Verificar UUID válido
      if (!validateUUID(codigoLimpio)) {
        console.warn('❌ Código no es UUID válido:', codigoLimpio);
        Alert.alert(t('common.error'), "El código escaneado no es un UUID válido.");
        setScanned(false);
        return;
      }

      const deviceId = await getOrCreateDeviceId();
      console.log('📱 Device ID:', deviceId);

      // Validaciones Previas: Verificar deviceId no esté vacío
      if (!deviceId) {
        Alert.alert(t('common.error'), "No se pudo generar o recuperar un ID único para el dispositivo.");
        setScanned(false);
        return;
      }

      // Obtener y verificar el token de autenticación
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        console.warn('❌ No hay token de usuario');
        Alert.alert(t('common.error'), "No se encontró una sesión activa. Por favor, inicie sesión.");
        setScanned(false);
        return;
      }

      // Depuración Obligatoria: Logs antes del post
      console.log('🔍 DATA ENVIADA:', JSON.stringify({ invite_code: codigoLimpio, id_unico: deviceId }));
      console.log('🔑 HEADERS:', { 'Content-Type': 'application/json', 'Authorization': 'Bearer ***' });

      console.log('📡 ENVIANDO PETICIÓN AL BACKEND');
      console.log('🚀 Iniciando vinculación con...', { invite_code: codigoLimpio, id_unico: deviceId });

      // Corregir la petición Axios con la estructura exacta
      const response = await api.post('/salas/link-device/', {
        invite_code: codigoLimpio, // Solo el UUID
        id_unico: deviceId         // El ID único del dispositivo (persistente)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('✅ Vinculación exitosa:', response.data);

      Alert.alert(
        t('scanner.linked_title') || 'Vinculado',
        t('scanner.linked_success') || 'Dispositivo vinculado correctamente a la sala.',
        [
          {
            text: 'OK',
            onPress: async () => {
              try {
                console.log('🔒 Activando Modo Kiosk...');
                await activateKioskMode();
              } catch (kioskError) {
                console.warn('⚠️ Error activando modo kiosk:', kioskError);
              }
              // Trigger a refresh/navigate back or to the room depending on the app flow
              navigation.navigate('TargetLockScreen', { roomId: codigoLimpio });
            },
          },
        ]
      );
    } catch (error) {
      // Manejo de Errores Mejorado
      console.error('💥 ERROR CRÍTICO EN FLUJO:', error);
      
      const msg = error.response?.data?.non_field_errors?.[0] || 
                  error.response?.data?.detail || 
                  error.response?.data?.error ||
                  error.message ||
                  'Error desconocido al vincular';

      if (error.response) {
        console.error('❌ ERROR BACKEND:', error.response.data);
        console.error('❌ STATUS:', error.response.status);
      } else {
        console.error('❌ ERROR DE RED O EJECUCIÓN:', error.message);
      }
      
      Alert.alert('Error de vinculación', msg);
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <X size={40} color="#FFF" />
      </TouchableOpacity>
      
      <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>{t('scanner.scan_instructions') || "Escanea el código QR del dispositivo"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  statusText: {
    color: '#FFF',
    textAlign: 'center',
  },
  permissionText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  permissionButton: {
    backgroundColor: '#4FB3C3',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#4FB3C3',
    backgroundColor: 'transparent',
  },
  scanText: {
    color: '#FFF',
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default CameraScannerScreen;
