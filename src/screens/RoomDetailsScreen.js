import React, { useState, useEffect } from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert } from 'react-native';
import { Undo2, QrCode, Smartphone, Tablet, CheckCircle2, XCircle, Home, Users, User, Pencil, Trash2, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { COLORS } from '../theme/colors';
import PremiumScreen from './PremiumScreen';

const { width } = Dimensions.get('window');

const RoomDetailsScreen = ({ route, navigation }) => {
  const { roomId, roomName, scanResult } = route.params;
  const { roomDevices, addDeviceToRoom, updateDevice, deleteDevice, blockAllDevicesInRoom, theme } = useAppContext();
  const { t } = useTranslation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [deviceNameInput, setDeviceNameInput] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    if (scanResult) {
      const success = addDeviceToRoom(roomId, `Dispositivo ${scanResult.substring(0, 8)}`);
      if (!success) {
        navigation.navigate('Premium');
      }
    }
  }, [scanResult]);

  const devices = roomDevices[roomId] || [];

  const handleBlockAllRoom = () => {
    Alert.alert(
      t('roomDetails.block_all_title') || "Bloquear toda la sala",
      t('roomDetails.block_all_confirm', { roomName }) || `¿Estás seguro que quieres bloquear todos los dispositivos de la sala "${roomName}"?`,
      [
        { text: t('common.cancel'), style: "cancel" },
        { 
          text: t('roomDetails.block_all') || "Bloquear Todo", 
          style: "destructive", 
          onPress: () => {
            blockAllDevicesInRoom(roomId);
            Alert.alert(t('common.success'), t('roomDetails.block_success') || "Todos los dispositivos de esta sala han sido bloqueados.");
          }
        }
      ]
    );
  };

  const handleEditDevice = (device) => {
    setCurrentDevice(device);
    setDeviceNameInput(device.name);
    setEditModalVisible(true);
  };

  const handleUpdateDevice = () => {
    if (deviceNameInput.trim() && currentDevice) {
        updateDevice(roomId, currentDevice.id, deviceNameInput);
        setEditModalVisible(false);
        setCurrentDevice(null);
    }
  };

  const handleDeleteDevice = (deviceId) => {
    Alert.alert(
        t('roomDetails.delete_device_title') || "Eliminar Dispositivo",
        t('roomDetails.delete_device_confirm') || "¿Estás seguro que quieres eliminar este dispositivo?",
        [
            { text: t('common.cancel'), style: "cancel" },
            { text: t('common.delete'), style: "destructive", onPress: () => deleteDevice(roomId, deviceId) }
        ]
    );
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
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
      <ScrollView style={[styles.content, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
        {devices.map((device) => (
          <View key={device.id} style={[styles.deviceCard, { backgroundColor: isDark ? '#333' : '#D9D9D9' }]}>
            <View style={styles.deviceIconBox}>
                {device.name.toLowerCase().includes('tablet') ? (
                    <Tablet size={60} color={isDark ? '#4FB3C3' : '#000'} />
                ) : (
                    <Smartphone size={60} color={isDark ? '#4FB3C3' : '#000'} />
                )}
            </View>
            <View style={styles.deviceInfo}>
              <View style={styles.deviceHeaderRow}>
                <Text style={[styles.deviceName, { color: isDark ? '#FFF' : '#000' }]}>{device.name}</Text>
                <View style={styles.deviceActions}>
                    <TouchableOpacity onPress={() => handleEditDevice(device)}>
                        <Pencil size={20} color="#6699CC" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteDevice(device.id)} style={{marginLeft: 15}}>
                        <Trash2 size={20} color="#FF4757" />
                    </TouchableOpacity>
                </View>
              </View>
              <View style={styles.statusRow}>
                {device.status === 'Activo' || device.status === 'Desbloqueado' ? (
                    <View style={styles.statusBadge}>
                        <CheckCircle2 size={24} color={COLORS.green} />
                        <Text style={[styles.statusText, { color: COLORS.green }]}>{t('roomDetails.active') || "Activo"}</Text>
                    </View>
                ) : (
                    <View style={styles.statusBadge}>
                        <XCircle size={24} color={COLORS.red} />
                        <Text style={[styles.statusText, { color: COLORS.red }]}>{t('roomDetails.locked') || "Bloqueado"}</Text>
                    </View>
                )}
                <TouchableOpacity onPress={() => navigation.navigate('DeviceControl', { roomId, deviceId: device.id, roomName })}>
                    <Text style={styles.verMasText}>{t('common.viewMore')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 10, backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }}>
          {/* Block All Button */}
          {devices.length > 0 && (
            <TouchableOpacity style={styles.blockAllButton} onPress={handleBlockAllRoom}>
              <Lock size={24} color="#FFF" />
              <Text style={styles.blockAllButtonText}>{t('roomDetails.block_all_room') || "Bloquear Sala Completa"}</Text>
            </TouchableOpacity>
          )}

          {/* Show QR Button */}
          <TouchableOpacity style={[styles.showQrButton, { backgroundColor: isDark ? '#4FB3C3' : '#4FB3C3' }]} onPress={() => navigation.navigate('QRCode', { roomId, roomName })}>
            <QrCode size={24} color="#FFF" />
            <Text style={styles.showQrButtonText}>{t('roomDetails.show_qr') || "Mostrar QR de la Sala"}</Text>
          </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#2D2D2D' : '#D9D9D9' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>{t('roomDetails.edit_device') || "Editar Dispositivo"}</Text>
            <TextInput
              style={[styles.modalInput, { color: isDark ? '#FFF' : '#000', borderBottomColor: isDark ? '#4FB3C3' : '#6C5CE7' }]}
              value={deviceNameInput}
              onChangeText={setDeviceNameInput}
              placeholder={t('roomDetails.device_name_placeholder') || "Nombre del dispositivo..."}
              placeholderTextColor="#888"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleUpdateDevice}
              >
                <Text style={[styles.buttonText, { color: '#FFF' }]}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#2D2D2D' : '#B0B0B0' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={32} color={isDark ? '#4FB3C3' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#4FB3C3' : '#000' }]}>{t('common.rooms')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>{t('common.account')}</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
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
    flex: 1,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 15,
    height: 120,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  deviceIconBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceInfo: {
    flex: 1,
    paddingLeft: 20,
  },
  deviceName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  deviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  deviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  verMasText: {
    fontSize: 16,
    color: '#6699CC',
    fontWeight: '600',
  },
  emptySpace: {
    height: 300,
    backgroundColor: '#A0A0A0',
  },
  blockAllButton: {
    backgroundColor: COLORS.red,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
  },
  blockAllButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  showQrButton: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  showQrButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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
  modalInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#6C5CE7',
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 30,
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

export default RoomDetailsScreen;
