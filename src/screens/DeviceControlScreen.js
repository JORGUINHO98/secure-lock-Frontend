import React, { useState } from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Smartphone, Clock, Lock, Unlock, Home, Users, User } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';
import Header from '../components/Header';
import InfoCard from '../components/InfoCard';
import CustomModal from '../components/CustomModal';
import { useKioskMode } from '../hooks/useKioskMode';



const { width } = Dimensions.get('window');

const DeviceControlScreen = ({ route, navigation }) => {
  const { roomId, deviceId, roomName: paramRoomName } = route.params;
  const { roomDevices, toggleDeviceStatus, theme, rooms } = useAppContext();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [tapCount, setTapCount] = useState(0);

  // Use the Kiosk Mode hook
  const { isActive: kioskActive, activateKioskMode, deactivateKioskMode } = useKioskMode();

  // Sync Kiosk mode with lock status
  React.useEffect(() => {
    if (isLocked) {
      activateKioskMode();
    }
  }, [isLocked, activateKioskMode]);

  // Handle secret gesture (5 taps) to exit Kiosk mode
  const handleSecretGesture = () => {
    const newCount = tapCount + 1;
    if (newCount >= 5) {
      deactivateKioskMode();
      setTapCount(0);
      Alert.alert("Admin", "Modo Kiosk desactivado manualmente.");
    } else {
      setTapCount(newCount);
      setTimeout(() => setTapCount(0), 2000);
    }
  };



  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  
  const room = rooms.find(r => r.id === roomId);
  const roomName = paramRoomName || (room ? room.name : 'Sala');

  if (!device) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Header title="Error" showBack onBack={() => navigation.goBack()} isDark={isDark} />
        <View style={styles.center}>
          <Text style={{ color: themeColors.text }}>Dispositivo no encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBlockPress = () => {
    if (device.status === 'Bloqueado') return;
    setConfirmModalVisible(true);
  };

  const handleConfirmBlock = async () => {
    setConfirmModalVisible(false);
    setIsLoading(true);
    try {
        await toggleDeviceStatus(roomId, deviceId, 'Bloqueado');
    } catch (error) {
        Alert.alert("Error", error.friendlyMessage || "No se pudo bloquear el dispositivo");
    } finally {
        setIsLoading(false);
    }
  };

  const handleUnlockPress = async () => {
    if (device.status === 'Activo' || device.status === 'Desbloqueado') return;
    setIsLoading(true);
    try {
        await toggleDeviceStatus(roomId, deviceId, 'Activo');
    } catch (error) {
        Alert.alert("Error", error.friendlyMessage || "No se pudo desbloquear el dispositivo");
    } finally {
        setIsLoading(false);
    }
  };



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />
      
      <Header 
        title={roomName}
        showBack
        onBack={() => navigation.goBack()}
        isDark={true}
      />
      <View style={[styles.contentWrapper, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Shield Visualization */}
        <View style={styles.shieldWrapper}>
          <View style={[
            styles.shieldOuter, 
            { backgroundColor: isLocked ? COLORS.status.locked + '10' : COLORS.status.unlocked + '10' }
          ]}>
            <View style={[
              styles.shieldInner, 
              SHADOWS.large,
              { backgroundColor: isLocked ? COLORS.status.locked : COLORS.status.unlocked }
            ]}>
              <Shield size={80} color="#FFFFFF" strokeWidth={1.5} />
            </View>
          </View>
          
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={handleSecretGesture}
            style={styles.statusBadge}
          >
            {isLocked ? <Lock size={16} color="#FFF" /> : <Unlock size={16} color="#FFF" />}
            <Text style={styles.statusBadgeText}>
              {isLocked ? 'SISTEMA BLOQUEADO' : 'SISTEMA ACTIVO'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Detalles</Text>
          <View style={styles.infoGrid}>
            <InfoCard 
              icon={Smartphone} 
              label="Dispositivo" 
              value={device.name} 
              color={COLORS.primary} 
            />
            <InfoCard 
              icon={Clock} 
              label="Tiempo Est." 
              value={device.estimatedTime || 'Manual'} 
              color={COLORS.accent} 
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Controles de Seguridad</Text>
          
          <TouchableOpacity 
            style={[
              styles.controlBtn, 
              { backgroundColor: COLORS.status.locked },
              isLocked && styles.disabledBtn
            ]}
            onPress={handleBlockPress}
            disabled={isLoading || isLocked}
          >
            <Lock size={24} color="#FFF" />
            <Text style={styles.controlBtnText}>Bloquear Ahora</Text>
            {isLoading && isLocked === false && <ActivityIndicator color="#FFF" style={{ marginLeft: 10 }} />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.controlBtn, 
              { backgroundColor: COLORS.status.unlocked },
              !isLocked && styles.disabledBtn
            ]}
            onPress={handleUnlockPress}
            disabled={isLoading || !isLocked}
          >
            <Unlock size={24} color="#FFF" />
            <Text style={styles.controlBtnText}>Desbloquear Acceso</Text>
            {isLoading && isLocked === true && <ActivityIndicator color="#FFF" style={{ marginLeft: 10 }} />}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>

      {/* Lock Mode Indicator */}
      {kioskActive && (
        <View style={styles.lockIndicator}>
          <Lock size={14} color="#FF3B30" />
        </View>
      )}



      {/* Confirmation Modal */}
      <CustomModal
        visible={confirmModalVisible}
        onClose={() => setConfirmModalVisible(false)}
        title="Confirmar Bloqueo"
        primaryLabel="Bloquear"
        primaryAction={handleConfirmBlock}
        secondaryLabel="Cancelar"
      >
        <Text style={[styles.modalText, { color: themeColors.textSecondary }]}>
          ¿Estás seguro que deseas bloquear el acceso a este dispositivo?
        </Text>
      </CustomModal>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
        <NavButton icon={Home} label="Inicio" onPress={() => navigation.navigate('Home')} isDark={isDark} />
        <NavButton icon={Users} label="Salas" onPress={() => navigation.navigate('Rooms')} isDark={isDark} />
        <NavButton icon={User} label="Cuenta" onPress={() => navigation.navigate('Account')} isDark={isDark} />
      </View>
    </SafeAreaView>
  );
};

const NavButton = ({ icon: Icon, label, active, onPress, isDark }) => {
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  const color = active ? COLORS.primary : themeColors.textSecondary;
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Icon size={24} color={color} strokeWidth={active ? 2.5 : 2} />
      <Text style={[styles.navText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  shieldWrapper: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  shieldOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginTop: -20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 1,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    marginBottom: SPACING.md,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    borderRadius: 20,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  disabledBtn: {
    opacity: 0.3,
  },
  modalText: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 90 : 70,
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    width: width / 3,
  },
  navText: {
    ...TYPOGRAPHY.small,
    marginTop: 4,
    fontWeight: '600',
  },
  lockIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    zIndex: 999,
  },
});


export default DeviceControlScreen;
