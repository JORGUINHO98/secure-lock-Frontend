import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [roomDevices, setRoomDevices] = useState({}); // { roomId: [devices] }
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [user, setUser] = useState(null);

  // Función para verificar el estado premium desde el backend
  const checkPremiumStatus = async () => {
    if (!user) return; // No verificar si no hay usuario
    
    try {
      const response = await api.get('/suscripciones/premium-status/');
      setIsPremium(response.data.has_active_premium);
    } catch (error) {
      // Usamos console.log en lugar de console.error para que no interrumpa con el cartel rojo en desarrollo
      console.log('Verificación premium fallida (posiblemente offline o endpoint inexistente)');
    }
  };

  useEffect(() => {
    if (user) {
      checkPremiumStatus();
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const logout = () => {
    setUser(null);
    setIsPremium(false);
  };

  const addRoom = (name) => {
    if (!isPremium && rooms.length >= 2) {
      return false;
    }
    if (isPremium && rooms.length >= 100) {
      alert('Has alcanzado el límite de 100 salas.');
      return false;
    }
    const id = Math.random().toString();
    const newRoom = {
      id,
      name,
      type: 'default'
    };
    setRooms([...rooms, newRoom]);
    setRoomDevices({ ...roomDevices, [id]: [] });
    return true;
  };

  const updateRoom = (id, newName) => {
    setRooms(rooms.map(room => room.id === id ? { ...room, name: newName } : room));
  };

  const deleteRoom = (id) => {
    setRooms(rooms.filter(room => room.id !== id));
    const newRoomDevices = { ...roomDevices };
    delete newRoomDevices[id];
    setRoomDevices(newRoomDevices);
  };

  const addDeviceToRoom = (roomId, deviceName) => {
    const currentDevices = roomDevices[roomId] || [];
    if (!isPremium && currentDevices.length >= 2) {
      return false; // Limit reached for free users
    }
    
    const newDevice = {
      id: Math.random().toString(),
      name: deviceName,
      status: 'Activo',
      estimatedTime: null
    };
    setRoomDevices({
      ...roomDevices,
      [roomId]: [...currentDevices, newDevice]
    });
    return true;
  };

  const updateDevice = (roomId, deviceId, newName) => {
    const updatedDevices = roomDevices[roomId].map(device =>
      device.id === deviceId ? { ...device, name: newName } : device
    );
    setRoomDevices({ ...roomDevices, [roomId]: updatedDevices });
  };

  const blockAllDevicesInRoom = (roomId) => {
    if (roomDevices[roomId]) {
      const updatedDevices = roomDevices[roomId].map(device => ({
        ...device,
        status: 'Bloqueado'
      }));
      setRoomDevices({
        ...roomDevices,
        [roomId]: updatedDevices
      });
    }
  };

  const setDeviceSchedule = (roomId, deviceId, schedule) => {
    const updatedDevices = roomDevices[roomId].map(device =>
      device.id === deviceId ? { ...device, estimatedTime: schedule } : device
    );
    setRoomDevices({ ...roomDevices, [roomId]: updatedDevices });
  };

  const deleteDevice = (roomId, deviceId) => {
    const updatedDevices = roomDevices[roomId].filter(device => device.id !== deviceId);
    setRoomDevices({ ...roomDevices, [roomId]: updatedDevices });
  };

  const toggleDeviceStatus = (roomId, deviceId) => {
    const updatedDevices = roomDevices[roomId].map(device =>
      device.id === deviceId
        ? { ...device, status: device.status === 'Activo' ? 'Bloqueado' : 'Activo' }
        : device
    );
    setRoomDevices({ ...roomDevices, [roomId]: updatedDevices });
  };

  const blockAllInRoom = (roomId) => {
    const updatedDevices = roomDevices[roomId].map(device => ({ ...device, status: 'Bloqueado' }));
    setRoomDevices({ ...roomDevices, [roomId]: updatedDevices });
  };

  const blockAllRooms = () => {
    const newRoomDevices = { ...roomDevices };
    Object.keys(newRoomDevices).forEach(roomId => {
      newRoomDevices[roomId] = newRoomDevices[roomId].map(device => ({ ...device, status: 'Bloqueado' }));
    });
    setRoomDevices(newRoomDevices);
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
      blockAllDevicesInRoom,
      deleteDevice,
      setDeviceSchedule,
      toggleDeviceStatus,
      blockAllInRoom,
      blockAllRooms,
      theme,
      toggleTheme,
      user,
      setUser,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
