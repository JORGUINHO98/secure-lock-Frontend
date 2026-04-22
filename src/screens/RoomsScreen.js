import React, { useState } from 'react';
import {
  View,
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
  Alert
} from 'react-native';
import { Undo2, Plus, Home, Users, User, Pencil, Trash2, Home as HomeIcon, Lock } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import PremiumScreen from './PremiumScreen';

const { width } = Dimensions.get('window');

const RoomsScreen = ({ navigation }) => {
  const { rooms, isPremium, addRoom, updateRoom, deleteRoom, blockAllRooms, theme } = useAppContext();
  const [premiumVisible, setPremiumVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomNameInput, setRoomNameInput] = useState('');
  const isDark = theme === 'dark';

  const handlePlusPress = () => {
    if (!isPremium && rooms.length >= 2) {
      setPremiumVisible(true);
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
        setPremiumVisible(true);
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

  const handleBlockAllPress = () => {
    setBlockModalVisible(true);
  };

  const handleConfirmFirstModal = () => {
    setBlockModalVisible(false);
    // Show second confirmation step
    Alert.alert(
      "Confirmación Final",
      "Se bloqueará toda la sala. Todos los dispositivos dentro de las salas que contenga serán bloqueados.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Bloquear", 
          style: "destructive", 
          onPress: () => {
            blockAllRooms();
            Alert.alert("Éxito", "Salas bloqueadas correctamente.");
          } 
        }
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
            <Text style={[styles.emptyText, { color: isDark ? '#AAA' : '#666' }]}>No hay salas creadas. Pulsa (+) para crear una.</Text>
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
                      <Pencil size={20} color="#6699CC" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress(room.id)} style={styles.actionBtn}>
                      <Trash2 size={20} color="#FF4757" />
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

        <View style={[styles.emptySpace, { backgroundColor: isDark ? '#1A1A1A' : '#A0A0A0' }]} />
      </ScrollView>

      {/* Block All Button */}
      {rooms.length > 0 && (
        <TouchableOpacity
          style={styles.blockAllButton}
          onPress={() => {
            setBlockModalVisible(true);
          }}
        >
          <Text style={styles.blockAllText}>Bloqueaar toda la sala</Text>
        </TouchableOpacity>
      )}

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: isDark ? '#4FB3C3' : '#000' }]} onPress={handlePlusPress}>
        <Plus size={80} color="#FFF" strokeWidth={1.5} />
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

      {/* Confirmation Modal for Blocking */}
      <Modal visible={blockModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              ¿Estas seguro que quieres Bloquear todala Sala?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBlockModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmFirstModal}
              >
                <Text style={[styles.buttonText, { color: '#FFF' }]}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

      <PremiumScreen
        visible={premiumVisible}
        onClose={() => setPremiumVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#666',
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  blockBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF1E1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  blockBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  verMasButton: {
    alignSelf: 'flex-end',
  },
  verMasText: {
    fontSize: 18,
    color: '#6699CC',
    fontWeight: '600',
  },
  blockAllButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 140, // Space for the FAB
    height: 60,
    backgroundColor: '#FF1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  blockAllText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptySpace: {
    height: 400,
    backgroundColor: '#A0A0A0',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 110,
    height: 110,
    borderRadius: 55,
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
