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
import { Undo2, Plus, Home, Users, User, Pencil, Trash2, Home as HomeIcon, Lock } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import PremiumScreen from './PremiumScreen';

const { width } = Dimensions.get('window');

const RoomsScreen = ({ navigation }) => {
  const { rooms, isPremium, addRoom, updateRoom, deleteRoom, theme } = useAppContext();
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomNameInput, setRoomNameInput] = useState('');
  const isDark = theme === 'dark';

  const handlePlusPress = () => {
    if (!isPremium && rooms.length >= 1) {
      Alert.alert(
        "Límite alcanzado",
        "Alcanzaste el límite de salas gratuitas. ¡Hazte Premium para crear salas ilimitadas!",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Ver Premium", onPress: () => navigation.navigate('Premium') }
        ]
      );
    } else {
      setCurrentRoom(null);
      setRoomNameInput('');
      setCreateModalVisible(true);
    }
  };

  const handleCreateRoom = () => {
    if (roomNameInput.trim()) {
      const success = addRoom(roomNameInput);
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

  const handleUpdateRoom = () => {
    if (roomNameInput.trim() && currentRoom) {
      updateRoom(currentRoom.id, roomNameInput);
      setEditModalVisible(false);
      setCurrentRoom(null);
    }
  };

  const handleDeletePress = (id) => {
    Alert.alert(
      "Eliminar Sala",
      "¿Estás seguro que quieres eliminar esta sala?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteRoom(id) }
      ]
    );
  };

  const getRoomIcon = (type) => {
    return (
      <View style={[styles.iconContainer, { backgroundColor: isDark ? '#4FB3C3' : '#6C5CE7' }]}>
        <HomeIcon size={60} color="#FFF" />
      </View>
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
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>Mis Salas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={[styles.content, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}>
        {rooms.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={60} color={isDark ? '#333' : '#CCC'} style={{ marginBottom: 20 }} />
            <Text style={[styles.emptyTitle, { color: isDark ? '#FFF' : '#333' }]}>No hay salas aún</Text>
            <Text style={[styles.emptySubtitle, { color: isDark ? '#AAA' : '#666' }]}>Pulsa el botón (+) para crear tu primera sala y empezar a gestionar tus dispositivos.</Text>
          </View>
        ) : (
          rooms.map((room) => (
            <View key={room.id} style={[styles.roomCard, { backgroundColor: isDark ? '#333' : '#D9D9D9' }]}>
              {getRoomIcon(room.type)}
              <View style={styles.roomInfo}>
                <View style={styles.roomHeaderRow}>
                  <Text style={[styles.roomName, { color: isDark ? '#FFF' : '#000' }]}>{room.name}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => handleEditPress(room)} style={styles.actionBtn}>
                      <Pencil size={20} color={COLORS.blue} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress(room.id)} style={styles.actionBtn}>
                      <Trash2 size={20} color={COLORS.red} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.verMasButton}
                  onPress={() => navigation.navigate('RoomDetails', { roomId: room.id, roomName: room.name })}
                >
                  <Text style={styles.verMasText}>Ver Mas</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: isDark ? '#4FB3C3' : '#000' }]} onPress={handlePlusPress}>
        <Plus size={32} color="#FFF" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#2D2D2D' : '#B0B0B0' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={1}>
          <Users size={32} color={isDark ? '#4FB3C3' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#4FB3C3' : '#000' }]}>Salas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Cuenta</Text>
        </TouchableOpacity>
      </View>

      {/* Create Modal */}
      <Modal visible={createModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Sala</Text>
            <TextInput
              style={styles.modalInput}
              value={roomNameInput}
              onChangeText={setRoomNameInput}
              placeholder="Nombre de la sala..."
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setCreateModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateRoom}
              >
                <Text style={[styles.buttonText, { color: '#FFF' }]}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Sala</Text>
            <TextInput
              style={styles.modalInput}
              value={roomNameInput}
              onChangeText={setRoomNameInput}
              placeholder="Nuevo nombre..."
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleUpdateRoom}
              >
                <Text style={[styles.buttonText, { color: '#FFF' }]}>Guardar</Text>
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
    backgroundColor: '#FFF',
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
  content: {
    flex: 1,
    backgroundColor: '#FFF',
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
    backgroundColor: '#D9D9D9',
    marginVertical: 1,
    padding: 10,
    height: 120,
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
    color: '#6699CC',
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
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

export default RoomsScreen;
