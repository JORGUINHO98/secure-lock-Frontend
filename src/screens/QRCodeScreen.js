import React, { useState, useEffect } from 'react';
import { 
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
import { Menu, LogOut, CheckCircle2, Undo2, X } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, SPACING } from '../theme/colors';
import api from '../services/api';

const { width } = Dimensions.get('window');

const QRCodeScreen = ({ route, navigation }) => {
  const { theme, logout, user } = useAppContext();
  const roomId = route?.params?.roomId || 'default-room-id';
  const isDark = theme === 'dark';
  const [qrCodeData, setQrCodeData] = useState(roomId);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchQR = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/salas/${roomId}/qr/`);
        setQrCodeData(response.data.invite_code || response.data.qr_base64 || roomId);
      } catch (error) {
        console.error("Error fetching QR:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (roomId !== 'default-room-id') {
      fetchQR();
    }
  }, [roomId]);

  const generateNewId = () => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    setQrCodeData(`parent-${timestamp}-${randomStr}`);
  };

  const handleLogout = () => {
    Alert.alert(
        "Cerrar Sesión",
        "¿Estás seguro que quieres salir?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: () => logout() }
        ]
      );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#D9D9D9' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={40} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>QR de Sala</Text>
        <View style={{ width: 40 }} />
      </View>

      <ImageBackground 
        source={isDark ? null : require('../assets/images/background.png')} 
        style={[styles.background, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}
        resizeMode="cover"
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.content}>

            {/* Success/Check Icon */}
            <View style={styles.iconContainer}>
                <CheckCircle2 size={120} color={isDark ? '#4FB3C3' : '#000'} strokeWidth={1.5} />
            </View>

            {/* Title and Subtitle */}
            <Text style={[styles.title, { color: isDark ? '#FFF' : '#1E234C' }]}>CONTROL DE DISPOSITIVO</Text>
            <Text style={[styles.subtitle, { color: isDark ? '#BBB' : '#000' }]}>
                Escanea este código desde el dispositivo que deseas controlar
            </Text>

            {/* QR Code Card */}
            <View style={[styles.qrCard, { backgroundColor: '#FFF' }]}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#000" style={{ height: width * 0.5, justifyContent: 'center' }} />
                ) : (
                  <QRCode
                  value={qrCodeData}
                  size={width * 0.5}
                  color="black"
                  backgroundColor="white"
                  />
                )}
            </View>

            {/* Device ID Display */}
            <View style={[styles.idContainer, { backgroundColor: isDark ? '#333' : '#D1D1D1' }]}>
                <Text style={[styles.idLabel, { color: isDark ? '#FFF' : '#000' }]}>ID del Dispositivo</Text>
                <Text style={[styles.idValue, { color: isDark ? '#FFF' : '#000' }]}>{qrCodeData}</Text>
            </View>

            {/* Generate New Button */}
            <TouchableOpacity style={[styles.generateButton, { backgroundColor: isDark ? '#4FB3C3' : COLORS.blue }]} onPress={generateNewId}>
                <Text style={[styles.generateButtonText, { color: isDark ? '#FFF' : '#000' }]}>Generar Nuevo QR</Text>
            </TouchableOpacity>
            </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8C3C0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#D9D9D9',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  backButton: {
    padding: 5,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  logoutButton: {
    backgroundColor: '#1E234C',
    padding: 6,
    borderRadius: 20,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E234C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
    marginVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  qrCard: {
    backgroundColor: '#FFF',
    padding: SPACING.lg,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: SPACING.lg,
  },
  idContainer: {
    backgroundColor: '#D1D1D1',
    padding: SPACING.md,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  idLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  idValue: {
    fontSize: 13,
    color: '#000',
    marginTop: 2,
  },
  generateButton: {
    backgroundColor: COLORS.blue,
    width: '100%',
    height: 56,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  generateButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

export default QRCodeScreen;
