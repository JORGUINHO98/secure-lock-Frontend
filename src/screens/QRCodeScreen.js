import React, { useState, useEffect, useCallback } from 'react';
import { 
  Platform,
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, Undo2, X } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, SPACING } from '../theme/colors';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const QRCodeScreen = ({ route, navigation }) => {
  const { theme, logout } = useAppContext();
  const { t } = useTranslation();
  const roomId = route?.params?.roomId;
  const roomName = route?.params?.roomName || 'Sala';
  const isDark = theme === 'dark';
  // Siempre inicializar con un string válido para el QR
  const [qrCodeData, setQrCodeData] = useState(`securelock://sala/${String(roomId || 'default')}`);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      if (!roomId) return;
      setIsLoading(true);
      try {
        const response = await api.get(`/salas/${roomId}/qr/`);
        const data = response.data.invite_code || response.data.qr_base64 || '';
        if (data && String(data).trim().length > 0) {
          setQrCodeData(String(data));
        }
      } catch (error) {
        console.log("QR fetch failed (usando ID local)");
        // Fallback: generar un QR con info de la sala
        setQrCodeData(`securelock://sala/${String(roomId)}?name=${encodeURIComponent(roomName)}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQR();
  }, [roomId]);

  const generateNewId = useCallback(() => {
    setIsLoading(true);
    // Usar un ID más corto para que el QR sea más simple y rápido de renderizar
    const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
    // Pequeño timeout para mostrar el loading y dejar que React procese
    setTimeout(() => {
      setQrCodeData(`SL-${shortId}`);
      setIsLoading(false);
    }, 150);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header immersive */}
      <View style={[styles.header, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={32} color={COLORS.text.white} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>QR de Sala</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>

            {/* Success/Check Icon (Slightly smaller) */}
            <View style={styles.iconContainer}>
                <CheckCircle2 size={100} color={isDark ? COLORS.accent : COLORS.secondary} strokeWidth={1.5} />
            </View>

            {/* Title and Subtitle */}
            <Text style={[styles.title, { color: isDark ? COLORS.text.white : COLORS.secondary }]}>CONTROL DE DISPOSITIVO</Text>
            <Text style={[styles.subtitle, { color: isDark ? COLORS.text.secondary : COLORS.text.secondary }]}>
                Escanea este código desde el dispositivo que deseas controlar
            </Text>

            {/* QR Code Card (Slightly smaller) */}
            <View style={[styles.qrCard, { backgroundColor: '#FFF' }]}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#000" style={{ height: width * 0.45, justifyContent: 'center' }} />
                ) : (
                  <QRCode
                  value={String(qrCodeData || 'securelock://error')}
                  size={width * 0.45}
                  color="black"
                  backgroundColor="white"
                  />
                )}
            </View>

            {/* Device ID Display */}
            <View style={[styles.idContainer, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.offWhite }]}>
                <Text style={[styles.idLabel, { color: COLORS.text.secondary }]}>ID del Dispositivo</Text>
                <Text style={[styles.idValue, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>{qrCodeData}</Text>
            </View>

            {/* Generate New Button */}
            <TouchableOpacity style={[styles.generateButton, { backgroundColor: isDark ? COLORS.accent : COLORS.primary }]} onPress={generateNewId}>
                <Text style={styles.generateButtonText}>Generar Nuevo QR</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  contentWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    marginVertical: 15,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  qrCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 25,
  },
  idContainer: {
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  idLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  idValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  generateButton: {
    width: '100%',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QRCodeScreen;
