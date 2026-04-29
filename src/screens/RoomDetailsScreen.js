import React, { useState, useEffect } from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 

  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Undo2, QrCode, Smartphone, Tablet, CheckCircle2, XCircle, Home, Users, User, Pencil, Trash2, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { COLORS } from '../theme/colors';
import PremiumScreen from './PremiumScreen';
import SkeletonLoader from '../components/SkeletonLoader';


const { width } = Dimensions.get('window');

const RoomDetailsScreen = ({ route, navigation }) => {
  const { roomId, roomName, scanResult } = route.params;
  const { roomDevices, addDeviceToRoom, updateDevice, deleteDevice, blockAllDevicesInRoom, theme } = useAppContext();
  const { t } = useTranslation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [deviceNameInput, setDeviceNameInput] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => setIsFetching(false), 800);
  }, []);


  useEffect(() => {
    const addScannedDevice = async () => {
      if (scanResult) {
        const success = await addDeviceToRoom(roomId, `Dispositivo ${scanResult.substring(0, 8)}`);
        if (!success) {
          navigation.navigate('Premium');
        }
      }
    };
    addScannedDevice();
  }, [scanResult]);

  const devices = roomDevices[roomId] || [];

  const handleBlockAllRoom = () => {
    Alert.alert(
      t('roomDetails.block_all_title') || "Bloquear toda la sala",
      t('roomDetails.block_all_confirm', { roomName }) || `¿Estás seguro que quieres bloquear todos los dispositivos de la sala "${roomName}"?`,
      [
        { text: t('common.cancel') || "Cancelar", style: "cancel" },
        { 
          text: t('roomDetails.block_all') || "Bloquear Todo", 
          style: "destructive", 
          onPress: async () => {
            await blockAllDevicesInRoom(roomId);
            Alert.alert(t('common.success') || "Éxito", t('roomDetails.block_success') || "Todos los dispositivos de esta sala han sido bloqueados.");
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

  const handleUpdateDevice = async () => {
    if (deviceNameInput.trim() && currentDevice) {
        await updateDevice(roomId, currentDevice.id, deviceNameInput);
        setEditModalVisible(false);
        setCurrentDevice(null);
    }
  };

  const handleDeleteDevice = (deviceId) => {
    Alert.alert(
        t('roomDetails.delete_device_title') || "Eliminar Dispositivo",
        t('roomDetails.delete_device_confirm') || "¿Estás seguro que quieres eliminar este dispositivo?",
        [
            { text: t('common.cancel') || "Cancelar", style: "cancel" },
            { text: t('common.delete') || "Eliminar", style: "destructive", onPress: () => deleteDevice(roomId, deviceId) }
        ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.secondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={40} color={COLORS.text.white} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>{roomName}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: COLORS.background.main }]}>
      <ScrollView style={[styles.content, { backgroundColor: COLORS.background.main }]}>
        {isFetching ? (
          <View style={{ padding: 15 }}>
            {[1, 2, 3].map(i => (
              <SkeletonLoader key={i} width="100%" height={120} borderRadius={16} style={{ marginBottom: 12 }} />
            ))}
          </View>
        ) : devices.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 }}>
            <Smartphone size={64} color={COLORS.text.secondary} />
            <Text style={{ color: COLORS.text.secondary, marginTop: 15 }}>{t('roomDetails.no_devices') || "No hay dispositivos en esta sala"}</Text>
          </View>
        ) : (
          devices.map((device) => (
            <View key={device.id} style={[styles.deviceCard, { backgroundColor: COLORS.background.surface }]}>
              <View style={styles.deviceIconBox}>
                  {device.name.toLowerCase().includes('tablet') ? (
                      <Tablet size={60} color={COLORS.primary} />
                  ) : (
                      <Smartphone size={60} color={COLORS.primary} />
                  )}
              </View>
              <View style={styles.deviceInfo}>
                <View style={styles.deviceHeaderRow}>
                  <Text style={[styles.deviceName, { color: COLORS.text.main }]}>{device.name}</Text>
                  <View style={styles.deviceActions}>
                      <TouchableOpacity 
                        onPress={() => handleEditDevice(device)}
                        accessibilityLabel={`Editar ${device.name}`}
                        accessibilityRole="button"
                      >
                          <Pencil size={20} color={COLORS.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDeleteDevice(device.id)} 
                        style={{marginLeft: 15}}
                        accessibilityLabel={`Eliminar ${device.name}`}
                        accessibilityRole="button"
                      >
                          <Trash2 size={20} color={COLORS.status.locked} />
                      </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.statusRow}>
                  {device.status === 'Activo' || device.status === 'Desbloqueado' ? (
                      <View style={styles.statusBadge}>
                          <CheckCircle2 size={24} color={COLORS.status.unlocked} />
                          <Text style={[styles.statusText, { color: COLORS.status.unlocked }]}>{t('roomDetails.active') || "Activo"}</Text>
                      </View>
                  ) : (
                      <View style={styles.statusBadge}>
                          <XCircle size={24} color={COLORS.status.locked} />
                          <Text style={[styles.statusText, { color: COLORS.status.locked }]}>{t('roomDetails.locked') || "Bloqueado"}</Text>
                      </View>
                  )}
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('DeviceControl', { roomId, deviceId: device.id, roomName })}
                    accessibilityLabel={`Ver detalles de ${device.name}`}
                    accessibilityRole="button"
                  >
                      <Text style={[styles.verMasText, { color: COLORS.primary }]}>{t('common.viewMore') || "Ver Más"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 10, backgroundColor: COLORS.background.main }}>
          {/* Block All Button */}
          {devices.length > 0 && (
            <TouchableOpacity style={[styles.blockAllButton, { backgroundColor: COLORS.status.locked }]} onPress={handleBlockAllRoom}>
              <Lock size={24} color={COLORS.text.white} />
              <Text style={[styles.blockAllButtonText, { color: COLORS.text.white }]}>{t('roomDetails.block_all_room') || "Bloquear Sala Completa"}</Text>
            </TouchableOpacity>
          )}

          {/* Show QR Button */}
          <TouchableOpacity style={[styles.showQrButton, { backgroundColor: COLORS.primary }]} onPress={() => navigation.navigate('QRCode', { roomId, roomName })}>
            <QrCode size={24} color={COLORS.text.white} />
            <Text style={[styles.showQrButtonText, { color: COLORS.text.white }]}>{t('roomDetails.show_qr') || "Mostrar QR de la Sala"}</Text>
          </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: COLORS.background.surface }]}>
            <Text style={[styles.modalTitle, { color: COLORS.text.main }]}>{t('roomDetails.edit_device') || "Editar Dispositivo"}</Text>
            <TextInput
              style={[styles.modalInput, { color: COLORS.text.main, borderBottomColor: COLORS.primary }]}
              value={deviceNameInput}
              onChangeText={setDeviceNameInput}
              placeholder={t('roomDetails.device_name_placeholder') || "Nombre del dispositivo..."}
              placeholderTextColor={COLORS.text.secondary}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: COLORS.status.locked }]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: COLORS.text.white }]}>{t('common.cancel') || "Cancelar"}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: COLORS.primary }]} 
                onPress={handleUpdateDevice}
              >
                <Text style={[styles.buttonText, { color: COLORS.text.white }]}>{t('common.save') || "Guardar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: COLORS.background.surface }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={28} color={COLORS.secondary} />
          <Text style={[styles.navText, { color: COLORS.secondary }]}>{t('common.home') || "Inicio"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={1}>
          <Users size={28} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary }]}>{t('common.rooms') || "Salas"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={28} color={COLORS.secondary} />
          <Text style={[styles.navText, { color: COLORS.secondary }]}>{t('common.account') || "Cuenta"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 25,
    paddingBottom: 15,
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
    fontWeight: '600',
  },
  emptySpace: {
    height: 300,
    backgroundColor: '#A0A0A0',
  },
  blockAllButton: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  blockAllButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  showQrButton: {
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  showQrButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 90 : 70,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background.surface,
    width: '90%',
    padding: 20,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: COLORS.text.main,
  },
  modalInput: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 30,
    color: COLORS.text.main,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
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
    color: COLORS.text.white,
  }
});

export default RoomDetailsScreen;
