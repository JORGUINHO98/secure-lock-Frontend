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
import { COLORS } from '../theme/colors';

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
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#A8C3C0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#A8C3C0' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={40} color={isDark ? '#FFF' : '#1E234C'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1E234C' }]}>{roomName}</Text>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Shield Icon */}
        <View style={[styles.shieldContainer, { backgroundColor: isDark ? '#333' : '#2D3436' }]}>
            <Shield size={100} color={device.status === 'Bloqueado' ? COLORS.red : COLORS.green} />
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
            <View style={styles.statusLabelRow}>
                {device.status === 'Bloqueado' ? <Lock size={24} color={COLORS.red} /> : <Unlock size={24} color={COLORS.green} />}
                <Text style={[styles.statusLabel, { color: isDark ? '#FFF' : '#000' }]}>Estado del Dispositivo:</Text>
            </View>
            <Text style={[styles.statusValue, { color: device.status === 'Bloqueado' ? COLORS.red : COLORS.green }]}>
                {device.status === 'Bloqueado' ? 'BLOQUEADO' : 'ACTIVO'}
            </Text>
        </View>

        {/* Control Section */}
        <View style={styles.configSection}>
            <Text style={[styles.configTitle, { color: isDark ? '#FFF' : '#000' }]}>Controles:</Text>
            
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
            <Text style={[styles.configTitle, { color: isDark ? '#FFF' : '#000' }]}>Información:</Text>
            <View style={styles.infoRow}>
                <View style={[styles.infoCard, { backgroundColor: isDark ? '#333' : '#D9D9D9' }]}>
                    <Smartphone size={32} color={isDark ? '#FFF' : '#000'} />
                    <Text style={[styles.infoCardLabel, { color: isDark ? '#BBB' : '#444' }]}>Modelo</Text>
                    <Text style={[styles.infoCardText, { color: isDark ? '#FFF' : '#000' }]}>{device.name}</Text>
                </View>
                <View style={[styles.infoCard, { backgroundColor: isDark ? '#333' : '#D9D9D9' }]}>
                    <Clock size={32} color={isDark ? '#FFF' : '#000'} />
                    <Text style={[styles.infoCardLabel, { color: isDark ? '#BBB' : '#444' }]}>Tiempo Est.</Text>
                    <Text style={[styles.infoCardText, { color: isDark ? '#FFF' : '#000' }]}>{device.estimatedTime || 'No configurado'}</Text>
                </View>
            </View>
        </View>
      </ScrollView>
      </View>

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
    backgroundColor: '#2D3436',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
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
    borderRadius: 10,
    elevation: 4,
  },
  blockButton: {
    backgroundColor: COLORS.red,
  },
  unblockButton: {
    backgroundColor: COLORS.green,
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
    backgroundColor: '#D9D9D9',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
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
    backgroundColor: '#D9D9D9',
    width: '85%',
    padding: 20,
    borderRadius: 15,
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
    backgroundColor: '#C84343',
  },
  confirmButton: {
    backgroundColor: '#3E76C5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
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
});

export default DeviceControlScreen;
