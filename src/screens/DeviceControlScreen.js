import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Image,
  Modal,
  Alert,
  ScrollView
} from 'react-native';
import { Undo2, ShieldCheck, Lock, Unlock, Home, Users, User, Clock, Star } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const DeviceControlScreen = ({ route, navigation }) => {
  const { roomId, deviceId, roomName: paramRoomName } = route.params;
  const { roomDevices, toggleDeviceStatus, theme, rooms } = useAppContext();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const isDark = theme === 'dark';

  const room = rooms.find(r => r.id === roomId);
  const roomName = paramRoomName || room?.name || 'Desconocida';
  const device = roomDevices[roomId]?.find(d => d.id === deviceId);

  if (!device) return null;

  const isBlocked = device.status === 'Bloqueado';

  const handleToggle = () => {
    toggleDeviceStatus(roomId, deviceId);
  };

  const handleConfirmBlock = () => {
    handleToggle();
    setConfirmModalVisible(false);
    Alert.alert("Éxito", "Se bloqueó el dispositivo correctamente.");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#A0A0A0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#D9D9D9' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={50} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>{device.name}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.content}>
            {/* Shield Icon / Image Placeholder */}
            <View style={[styles.shieldContainer, { backgroundColor: isDark ? '#333' : '#2D3436' }]}>
            <View style={styles.shieldOuter}>
                <ShieldCheck size={120} color={isDark ? '#4FB3C3' : '#4FB3C3'} strokeWidth={1} />
            </View>
            </View>

            {/* Status */}
            <View style={styles.statusSection}>
                <View style={styles.statusLabelRow}>
                    <Star size={20} color="#6C5CE7" fill="#6C5CE7" />
                    <Text style={[styles.statusLabel, { color: isDark ? '#FFF' : '#000' }]}>Estado</Text>
                </View>
                <Text style={[styles.statusValue, { color: isDark ? '#4FB3C3' : '#000' }]}>{isBlocked ? 'Bloqueado' : 'Desbloqueado'}</Text>
            </View>

            {/* Config Section */}
            <View style={styles.configSection}>
                <TouchableOpacity onPress={() => navigation.navigate('LockConfig', { roomId, deviceId })}>
                    <Text style={[styles.configTitle, { color: isDark ? '#FFF' : '#000' }]}>Conf. de Bloqueo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.actionButton, 
                        styles.blockButton,
                        (!device.estimatedTime || isBlocked) && styles.disabledButton
                    ]} 
                    onPress={() => !isBlocked && device.estimatedTime && setConfirmModalVisible(true)}
                    activeOpacity={0.7}
                    disabled={!device.estimatedTime || isBlocked}
                >
                    <Lock size={30} color="#000" />
                    <Text style={styles.actionButtonText}>Bloquear Ahora</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.actionButton, styles.unblockButton, !isBlocked && styles.disabledButton]} 
                    onPress={() => isBlocked && handleToggle()}
                    activeOpacity={0.7}
                    disabled={!isBlocked}
                >
                    <Unlock size={30} color="#000" />
                    <Text style={styles.actionButtonText}>Desbloquear</Text>
                </TouchableOpacity>
            </View>

            {/* Info Cards */}
            <View style={styles.infoSection}>
                <Text style={[styles.infoLabel, { color: isDark ? '#FFF' : '#000' }]}>Sala:</Text>
                <TouchableOpacity 
                    style={[styles.infoCard, { backgroundColor: isDark ? '#2D2D2D' : '#D9D9D9' }]}
                    onPress={() => navigation.navigate('RoomDetails', { roomId, roomName })}
                >
                    <Home size={32} color={isDark ? '#FFF' : '#000'} />
                    <Text style={[styles.infoCardText, { color: isDark ? '#FFF' : '#000' }]}>{roomName}</Text>
                </TouchableOpacity>

                <Text style={[styles.infoLabel, { color: isDark ? '#FFF' : '#000' }]}>Tiempo estimado de bloqueo:</Text>
                <View style={[styles.infoCard, { backgroundColor: isDark ? '#2D2D2D' : '#D9D9D9' }]}>
                    <Clock size={32} color={isDark ? '#FFF' : '#000'} />
                    <Text style={[styles.infoCardText, { color: isDark ? '#FFF' : '#000' }]}>{device.estimatedTime || 'No configurado'}</Text>
                </View>
            </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={confirmModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#2D2D2D' : '#D9D9D9' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>
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
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#2D2D2D' : '#B0B0B0' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Salas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A0A0A0', // Matches the grey background in screenshot
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#D9D9D9',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 15,
  },
  backButton: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 2,
    borderWidth: 2,
    borderColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  shieldContainer: {
    marginVertical: 30,
    width: 150,
    height: 150,
    backgroundColor: '#2D3436',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  shieldOuter: {
    padding: 10,
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 0, // Requested square design
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  blockButton: {
    backgroundColor: '#FF1E1E',
  },
  unblockButton: {
    backgroundColor: '#00FF00',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#B0B0B0',
  },
  actionButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 15,
  },
  infoSection: {
    width: '100%',
  },
  infoLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    padding: 12,
    marginBottom: 20,
  },
  infoCardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#B0B0B0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#D9D9D9',
    width: '90%',
    padding: 20,
    borderRadius: 0,
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
    borderRadius: 0,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#C84343',
  },
  confirmButton: {
    backgroundColor: '#3E76C5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  }
});

export default DeviceControlScreen;
