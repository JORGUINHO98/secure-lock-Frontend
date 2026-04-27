import React, { useState } from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView } from 'react-native';
import { Undo2, Shield, Settings, Clock, Smartphone, CheckCircle2, XCircle, Home, Users, User, Lock, Unlock } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../theme/colors';

const { width } = Dimensions.get('window');

const DeviceControlScreen = ({ route, navigation }) => {
  const { roomId, deviceId, roomName: paramRoomName } = route.params;
  const { roomDevices, toggleDeviceStatus, theme, rooms } = useAppContext();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDark = theme === 'dark';
  
  // Find the room name if not provided
  const room = rooms.find(r => r.id === roomId);
  const roomName = paramRoomName || (room ? room.name : 'Sala');

  // Find the device
  const device = roomDevices[roomId]?.find(d => d.id === deviceId);

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Dispositivo no encontrado</Text>
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
        Alert.alert("Error", "No se pudo bloquear el dispositivo");
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
        Alert.alert("Error", "No se pudo desbloquear el dispositivo");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={36} color={COLORS.text.white} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>{roomName}</Text>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.main }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Shield Icon */}
        <View style={[styles.shieldContainer, { backgroundColor: isDark ? '#2A2F45' : COLORS.secondary }]}>
            <Shield size={100} color={device.status === 'Bloqueado' ? COLORS.status.locked : COLORS.status.unlocked} />
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
            <View style={styles.statusLabelRow}>
                {device.status === 'Bloqueado' ? <Lock size={24} color={COLORS.status.locked} /> : <Unlock size={24} color={COLORS.status.unlocked} />}
                <Text style={[styles.statusLabel, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Estado del Dispositivo:</Text>
            </View>
            <Text style={[styles.statusValue, { color: device.status === 'Bloqueado' ? COLORS.status.locked : COLORS.status.unlocked }]}>
                {device.status === 'Bloqueado' ? 'BLOQUEADO' : 'ACTIVO'}
            </Text>
        </View>

        {/* Control Section */}
        <View style={styles.configSection}>
            <Text style={[styles.configTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Controles:</Text>
            
            <TouchableOpacity 
                style={[styles.actionButton, styles.blockButton, device.status === 'Bloqueado' && styles.disabledButton]}
                onPress={handleBlockPress}
                disabled={isLoading || device.status === 'Bloqueado'}
            >
                <Lock size={32} color="#FFF" />
                <Text style={styles.actionButtonText}>BLOQUEAR</Text>
                {isLoading && device.status === 'Activo' && <ActivityIndicator color="#FFF" style={{marginLeft: 10}} />}
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.actionButton, styles.unblockButton, (device.status === 'Activo' || device.status === 'Desbloqueado') && styles.disabledButton]}
                onPress={handleUnlockPress}
                disabled={isLoading || device.status === 'Activo' || device.status === 'Desbloqueado'}
            >
                <Unlock size={32} color="#FFF" />
                <Text style={styles.actionButtonText}>DESBLOQUEAR</Text>
                {isLoading && device.status === 'Bloqueado' && <ActivityIndicator color="#FFF" style={{marginLeft: 10}} />}
            </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.configSection}>
            <Text style={[styles.configTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Información:</Text>
            <View style={styles.infoRow}>
                <View style={[styles.infoCard, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}>
                    <Smartphone size={32} color={COLORS.primary} />
                    <Text style={[styles.infoCardLabel, { color: COLORS.text.secondary }]}>Modelo</Text>
                    <Text style={[styles.infoCardText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>{device.name}</Text>
                </View>
                <View style={[styles.infoCard, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}>
                    <Clock size={32} color={COLORS.primary} />
                    <Text style={[styles.infoCardLabel, { color: COLORS.text.secondary }]}>Tiempo Est.</Text>
                    <Text style={[styles.infoCardText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>{device.estimatedTime || 'No configurado'}</Text>
                </View>
            </View>
        </View>
      </ScrollView>
      </View>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}>
            <Text style={[styles.modalTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>
              ¿Estas seguro que quieres Bloquear el dispositivo?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleConfirmBlock}
              >
                <Text style={[styles.buttonText, { color: '#FFF' }]}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>Salas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>Cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 15,
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
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  shieldContainer: {
    marginVertical: 30,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },
  statusValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  configSection: {
    width: '100%',
    marginBottom: 25,
  },
  configTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 4,
  },
  blockButton: {
    backgroundColor: COLORS.status.locked,
  },
  unblockButton: {
    backgroundColor: COLORS.status.unlocked,
  },
  disabledButton: {
    opacity: 0.3,
  },
  actionButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoCard: {
    width: '48%',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoCardLabel: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  infoCardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 2,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: SPACING.lg,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.status.locked,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 90,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default DeviceControlScreen;
