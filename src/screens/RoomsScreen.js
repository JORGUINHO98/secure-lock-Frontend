import React, { useState } from 'react';
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
import { Undo2, Plus, Home, Users, User, Pencil, Trash2, Shield, Lock, Layout } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING } from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import PremiumScreen from './PremiumScreen';

const { width } = Dimensions.get('window');

const RoomsScreen = ({ navigation }) => {
  const { rooms, isPremium, addRoom, updateRoom, deleteRoom, theme } = useAppContext();
  const { t } = useTranslation();
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomNameInput, setRoomNameInput] = useState('');
  const isDark = theme === 'dark';

  const handlePlusPress = () => {
    if (!isPremium && rooms.length >= 2) {
      Alert.alert(
        t('rooms.limit_reached'),
        t('rooms.limit_reached_sub'),
        [
          { text: t('common.cancel'), style: "cancel" },
          { text: "Premium", onPress: () => navigation.navigate('Premium') }
        ]
      );
    } else {
      setCurrentRoom(null);
      setRoomNameInput('');
      setCreateModalVisible(true);
    }
  };

  const handleCreateRoom = async () => {
    if (roomNameInput.trim()) {
      const success = await addRoom(roomNameInput);
      if (success) {
        setRoomNameInput('');
        setCreateModalVisible(false);
      } else {
        setCreateModalVisible(false);
        navigation.navigate('Premium');
      }
    }
  };

  const handleEditPress = (room) => {
    setCurrentRoom(room);
    setRoomNameInput(room.name);
    setEditModalVisible(true);
  };

  const handleUpdateRoom = async () => {
    if (roomNameInput.trim() && currentRoom) {
      await updateRoom(currentRoom.id, roomNameInput);
      setEditModalVisible(false);
      setCurrentRoom(null);
    }
  };

  const handleDeletePress = (id) => {
    Alert.alert(
      t('rooms.delete_title'),
      t('rooms.delete_confirm'),
      [
        { text: t('common.cancel'), style: "cancel" },
        { text: t('common.delete'), style: "destructive", onPress: () => deleteRoom(id) }
      ]
    );
  };

  const getRoomIcon = (type) => {
    return (
      <View style={[styles.iconContainer, { backgroundColor: COLORS.primary }]}>
        <Shield size={60} color={COLORS.text.white} />
      </View>
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
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>{t('rooms.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: COLORS.background.main }]}>
      <ScrollView style={styles.content}>
        {rooms.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={60} color={isDark ? '#333' : '#CCC'} style={{ marginBottom: 20 }} />
            <Text style={[styles.emptyTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('rooms.no_rooms')}</Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('rooms.no_rooms_sub')}</Text>
          </View>
        ) : (
          rooms.map((room) => (
            <View key={room.id} style={[styles.roomCard, { backgroundColor: COLORS.background.surface }]}>
              {getRoomIcon(room.type)}
              <View style={styles.roomInfo}>
                <View style={styles.roomHeaderRow}>
                  <Text style={[styles.roomName, { color: COLORS.text.main }]}>{room.name}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleEditPress(room)} style={styles.actionBtn}>
                      <Pencil size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress(room.id)} style={styles.actionBtn}>
                      <Trash2 size={20} color={COLORS.status.locked} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.verMasButton}
                  onPress={() => navigation.navigate('RoomDetails', { roomId: room.id, roomName: room.name })}
                >
                  <Text style={[styles.verMasText, { color: COLORS.primary }]}>{t('common.viewMore')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: COLORS.primary }]} onPress={handlePlusPress}>
        <Plus size={32} color={COLORS.text.white} strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: COLORS.background.surface }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={28} color={COLORS.secondary} />
          <Text style={[styles.navText, { color: COLORS.secondary }]}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={1}>
          <Users size={28} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary }]}>{t('common.rooms')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={28} color={COLORS.secondary} />
          <Text style={[styles.navText, { color: COLORS.secondary }]}>{t('common.account')}</Text>
        </TouchableOpacity>
      </View>

      {/* Create Modal */}
      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('rooms.new_room')}</Text>
            <TextInput
              style={styles.modalInput}
              value={roomNameInput}
              onChangeText={setRoomNameInput}
              placeholder={t('rooms.room_name_placeholder')}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.buttonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateRoom}
              >
                <Text style={[styles.buttonText, { color: '#FFF' }]}>{t('common.create')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('rooms.edit_room')}</Text>
            <TextInput
              style={styles.modalInput}
              value={roomNameInput}
              onChangeText={setRoomNameInput}
              placeholder={t('rooms.room_name_placeholder')}
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
                onPress={handleUpdateRoom}
              >
                <Text style={[styles.buttonText, { color: '#FFF' }]}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  emptyState: {
    flex: 1,
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 12,
    height: 120,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  roomInfo: {
    flex: 1,
    paddingLeft: 20,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  roomHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 5,
    marginLeft: 10,
  },
  verMasButton: {
    alignSelf: 'flex-end',
  },
  verMasText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySpace: {
    height: 200,
    backgroundColor: '#A0A0A0',
  },
  fab: {
    position: 'absolute',
    bottom: 115,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    borderRadius: 12,
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
    color: COLORS.text.main,
  }
});

export default RoomsScreen;
