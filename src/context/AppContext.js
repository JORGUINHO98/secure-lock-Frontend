import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useAuth, useRooms, useDevices, useTheme, AppProvider as NewAppProvider } from './index';
import api from '../services/api';
import logger from '../utils/logger';

const AppContext = createContext();

/**
 * LegacyAppProvider actua como un puente para no romper los componentes existentes.
 * Consume los nuevos contextos modulares y expone la misma interfaz que el antiguo AppContext.
 */
const LegacyAppProvider = ({ children }) => {
  const { 
    user, setUser, logout, isPremium, setIsPremium, checkPremiumStatus, isInitialized, normalizeUserName 
  } = useAuth();
  
  const { 
    rooms, setRooms, fetchRooms, addRoom: originalAddRoom, updateRoom, deleteRoom 
  } = useRooms();
  
  const { 
    roomDevices, setRoomDevices, fetchDevices, addDeviceToRoom: originalAddDeviceToRoom, 
    updateDevice, deleteDevice, toggleDeviceStatus, blockAllInRoom, blockAllRooms, setDeviceSchedule 
  } = useDevices();
  
  const { theme, toggleTheme } = useTheme();

  // Función coordinada para refrescar ambos datos (manteniendo compatibilidad)
  const refreshRoomsAndDevices = useCallback(async () => {
    try {
      const fetchedRooms = await fetchRooms();
      await fetchDevices(fetchedRooms);
    } catch (error) {
      logger.log('Error en refresh coordinado:', error.message);
    }
  }, [fetchRooms, fetchDevices]);

  // Efectos de inicialización/sincronización
  useEffect(() => {
    if (user) {
      checkPremiumStatus();
      refreshRoomsAndDevices();
    }
  }, [user, checkPremiumStatus, refreshRoomsAndDevices]);

  // Wrappers para mantener la firma exacta de las funciones antiguas si variaron ligeramente
  const addRoom = async (name) => {
    return await originalAddRoom(name, isPremium, rooms.length);
  };

  const addDeviceToRoom = async (roomId, deviceName) => {
    const currentCount = (roomDevices[roomId] || []).length;
    return await originalAddDeviceToRoom(roomId, deviceName, isPremium, currentCount);
  };

  const blockAllDevicesInRoom = async (roomId) => {
    return await blockAllInRoom(roomId);
  };

  return (
    <AppContext.Provider value={{
      rooms,
      isPremium,
      setIsPremium,
      checkPremiumStatus,
      addRoom,
      updateRoom,
      deleteRoom,
      roomDevices,
      addDeviceToRoom,
      updateDevice,
      blockAllDevicesInRoom, // Alias para blockAllInRoom
      deleteDevice,
      setDeviceSchedule,
      toggleDeviceStatus,
      blockAllInRoom,
      blockAllRooms,
      theme,
      toggleTheme,
      user,
      setUser,
      logout,
      refreshRoomsAndDevices,
      isInitialized, // Agregado por si algún componente lo usa
      normalizeUserName
    }}>
      {children}
    </AppContext.Provider>
  );
};

// El AppProvider exportado ahora envuelve todo con los nuevos proveedores Y el bridge legacy
export const AppProvider = ({ children }) => {
  return (
    <NewAppProvider>
      <LegacyAppProvider>
        {children}
      </LegacyAppProvider>
    </NewAppProvider>
  );
};

export const useAppContext = () => useContext(AppContext);


