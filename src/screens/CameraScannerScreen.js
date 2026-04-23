import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const CameraScannerScreen = ({ route, navigation }) => {
  const { roomId } = route?.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container}><Text style={styles.statusText}>Cargando permisos...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Necesitamos tu permiso para mostrar la cámara</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    
    console.log('QR Escaneado:', data);
    const invite_code = data;
    const id_unico = `dispositivo-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Guardar el id_unico generado localmente para usarlo en la conexión WebSocket
      await AsyncStorage.setItem('deviceId', id_unico);
      
      const response = await api.post('/salas/link-device/', {
        invite_code,
        id_unico
      });
      
      Alert.alert(
        "Vinculado",
        "Dispositivo vinculado correctamente a la sala.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('TargetLockScreen', { roomId: invite_code })
          }
        ]
      );
    } catch (error) {
      console.error("Error al vincular el dispositivo:", error);
      Alert.alert(
        "Error",
        "No se pudo vincular el dispositivo. Intente de nuevo.",
        [
          {
            text: "Reintentar",
            onPress: () => setScanned(false)
          }
        ]
      );
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
          <Text style={styles.scanText}>Escanea el código QR del dispositivo</Text>
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
