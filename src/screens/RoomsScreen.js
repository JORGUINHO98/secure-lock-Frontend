import React, { useState, useCallback, memo } from 'react';

import { Platform, View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
  Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Home, Users, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';
import { useAppContext } from '../context/AppContext';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import CustomModal from '../components/CustomModal';
import CustomInput from '../components/CustomInput';
import SkeletonLoader from '../components/SkeletonLoader';


const { width } = Dimensions.get('window');

const RoomsScreen = ({ navigation }) => {
  const { rooms, isPremium, addRoom, updateRoom, deleteRoom, theme, roomDevices } = useAppContext();
  const { t } = useTranslation();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomNameInput, setRoomNameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  React.useEffect(() => {
    const init = async () => {
      setIsFetching(true);
      // Simular carga para ver skeleton o simplemente esperar al fetch
      setTimeout(() => setIsFetching(false), 800);
    };
    init();
  }, []);

  
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handlePlusPress = useCallback(() => {
    if (!isPremium && rooms.length >= 2) {
      Alert.alert(
        t('rooms.limit_reached') || "Límite alcanzado",
        t('rooms.limit_reached_sub') || "Suscríbete a Premium para crear más salas.",
        [
          { text: t('common.cancel') || "Cancelar", style: "cancel" },
          { text: "Premium", onPress: () => navigation.navigate('Premium') }
        ]
      );
    } else {
      setCurrentRoom(null);
      setRoomNameInput('');
      setCreateModalVisible(true);
    }
  }, [isPremium, rooms.length, t, navigation]);


  const handleCreateRoom = useCallback(async () => {
    if (!roomNameInput.trim()) return;
    setIsLoading(true);
    const success = await addRoom(roomNameInput);
    setIsLoading(false);
    if (success) {
      setRoomNameInput('');
      setCreateModalVisible(false);
    } else {
      setCreateModalVisible(false);
      navigation.navigate('Premium');
    }
  }, [roomNameInput, addRoom, navigation]);


  const handleEditPress = useCallback((room) => {
    setCurrentRoom(room);
    setRoomNameInput(room.name);
    setEditModalVisible(true);
  }, []);


  const handleUpdateRoom = useCallback(async () => {
    if (roomNameInput.trim() && currentRoom) {
      setIsLoading(true);
      await updateRoom(currentRoom.id, roomNameInput);
      setIsLoading(false);
      setEditModalVisible(false);
      setCurrentRoom(null);
    }
  }, [roomNameInput, currentRoom, updateRoom]);


  const handleDeletePress = useCallback((id) => {
    Alert.alert(
      t('rooms.delete_title') || "¿Eliminar Sala?",
      t('rooms.delete_confirm') || "¿Estás seguro que deseas eliminar esta sala?",
      [
        { text: t('common.cancel') || "Cancelar", style: "cancel" },
        { text: t('common.delete') || "Eliminar", style: "destructive", onPress: () => deleteRoom(id) }
      ]
    );
  }, [t, deleteRoom]);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />

      <Header 
        title={t('rooms.title') || "Mis Salas"}
        showBack
        onBack={() => navigation.goBack()}
        isDark={true}
      />
      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={{ paddingBottom: 120, paddingTop: SPACING.md }}
      >
        {isFetching ? (
          <View style={{ padding: SPACING.md }}>
            {[1, 2, 3].map(i => (
              <SkeletonLoader key={i} width="95%" height={100} borderRadius={16} style={{ marginBottom: SPACING.md, alignSelf: 'center' }} />
            ))}
          </View>
        ) : rooms.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
              <Users size={48} color={isDark ? COLORS.textSecondary : '#94A3B8'} />
            </View>
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>{t('rooms.no_rooms') || "No hay salas"}</Text>
            <Text style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}>{t('rooms.no_rooms_sub') || "Comienza creando tu primera sala segura."}</Text>
            
            <TouchableOpacity 
              style={[styles.emptyButton, { backgroundColor: COLORS.primary }]}
              onPress={handlePlusPress}
              accessibilityLabel="Crear mi primera sala"
              accessibilityRole="button"
            >
              <Text style={styles.emptyButtonText}>{t('rooms.add_first_room') || "Crear mi primera sala"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          rooms.map((room) => (
            <RoomCard 
              key={room.id}
              room={{
                ...room,
                deviceCount: (roomDevices[room.id] || []).length
              }}
              onEdit={() => handleEditPress(room)}
              onDelete={() => handleDeletePress(room.id)}
              onPress={() => navigation.navigate('RoomDetails', { roomId: room.id, roomName: room.name })}
              accessibilityLabel={`Sala ${room.name}`}
            />
          ))
        )}

      </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity 
        style={[styles.fab, SHADOWS.large, { backgroundColor: COLORS.primary }]} 
        onPress={handlePlusPress}
        accessibilityLabel="Agregar nueva sala"
        accessibilityRole="button"
      >
        <Plus size={32} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>


      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
        <NavButton 
          icon={Home} 
          label={t('common.home') || "Inicio"} 
          onPress={() => navigation.navigate('Home')} 
          isDark={isDark} 
        />
        <NavButton 
          icon={Users} 
          label={t('common.rooms') || "Salas"} 
          active 
          isDark={isDark} 
        />
        <NavButton 
          icon={User} 
          label={t('common.account') || "Cuenta"} 
          onPress={() => navigation.navigate('Account')} 
          isDark={isDark} 
        />
      </View>

      {/* Create Modal */}
      <CustomModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        title={t('rooms.new_room') || "Nueva Sala"}
        primaryLabel={t('common.create') || "Crear"}
        primaryAction={handleCreateRoom}
        secondaryLabel={t('common.cancel') || "Cancelar"}
        isLoading={isLoading}
      >
        <CustomInput
          label={t('rooms.room_name_label') || "Nombre de la Sala"}
          value={roomNameInput}
          onChangeText={setRoomNameInput}
          placeholder={t('rooms.room_name_placeholder') || "Ej: Sala Principal"}
          autoFocus
        />
      </CustomModal>

      {/* Edit Modal */}
      <CustomModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title={t('rooms.edit_room') || "Editar Sala"}
        primaryLabel={t('common.save') || "Guardar"}
        primaryAction={handleUpdateRoom}
        secondaryLabel={t('common.cancel') || "Cancelar"}
        isLoading={isLoading}
      >
        <CustomInput
          label={t('rooms.room_name_label') || "Nombre de la Sala"}
          value={roomNameInput}
          onChangeText={setRoomNameInput}
          placeholder={t('rooms.room_name_placeholder') || "Ej: Sala Principal"}
          autoFocus
        />
      </CustomModal>

    </SafeAreaView>
  );
};

const NavButton = memo(({ icon: Icon, label, active, onPress, isDark }) => {
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  const color = active ? COLORS.primary : themeColors.textSecondary;
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Icon size={24} color={color} strokeWidth={active ? 2.5 : 2} />
      <Text style={[styles.navText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
});


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
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    padding: SPACING.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.md,
  },
  emptyButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 16,
  },
  emptyButtonText: {
    ...TYPOGRAPHY.body,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 90,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
});

export default RoomsScreen;
