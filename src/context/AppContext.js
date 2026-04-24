import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [roomDevices, setRoomDevices] = useState({}); // { roomId: [devices] }
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [isInitialized, setIsInitialized] = useState(false);
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

  // Normalizar el nombre y la imagen del usuario desde diferentes campos del backend
  const normalizeUserName = (userData) => {
    const name =
      userData.full_name ||
      userData.name ||
      (userData.first_name && userData.last_name
        ? `${userData.first_name} ${userData.last_name}`.trim()
        : userData.first_name || userData.last_name || '') ||
      userData.username ||
      userData.email?.split('@')[0] ||
      '';
    
    // Normalizar también la imagen de perfil
    const avatar = userData.avatar || userData.profile_image || userData.photo || userData.image || null;
    
    return { ...userData, name, avatar };
  };

  // Cargar usuario desde SecureStore al iniciar, y re-validar con la API
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync('userData');
        const token = await SecureStore.getItemAsync('userToken');

        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(normalizeUserName(parsed));
        }

        // Si hay token, re-fetch del perfil para tener datos actualizados
        if (token) {
          try {
            const profileResponse = await api.get('/users/me/');
            const freshUser = normalizeUserName(profileResponse.data);
            setUser(freshUser);
          } catch (err) {
            console.log('No se pudo refrescar el perfil del usuario:', err.message);
          }
        }
      } catch (error) {
        console.log('Error cargando usuario de SecureStore', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadUser();
  }, []);

  // Guardar usuario en SecureStore cuando cambie (solo después de la carga inicial)
  useEffect(() => {
    if (!isInitialized) return;

    const saveUser = async () => {
      try {
        if (user) {
          await SecureStore.setItemAsync('userData', JSON.stringify(user));
        } else {
          await SecureStore.deleteItemAsync('userData');
        }
      } catch (error) {
        console.log('Error guardando usuario en SecureStore', error);
      }
    };
    saveUser();
  }, [user, isInitialized]);

  // Función reutilizable para obtener salas y dispositivos del backend
  const refreshRoomsAndDevices = useCallback(async () => {
    try {
      const [salasRes, dispositivosRes] = await Promise.all([
        api.get('/salas/'),
        api.get('/dispositivos/'),
      ]);

      setRooms(salasRes.data);

      // Agrupar dispositivos por sala (campo sala o room)
      const grouped = {};
      salasRes.data.forEach(sala => {
        grouped[sala.id] = [];
      });
      dispositivosRes.data.forEach(device => {
        const salaId = device.sala || device.room;
        if (salaId && grouped[salaId]) {
          grouped[salaId].push(device);
        } else if (salaId) {
          grouped[salaId] = [device];
        }
      });
      setRoomDevices(grouped);
    } catch (error) {
      console.log('Error cargando salas y dispositivos:', error.message);
    }
  }, []);

  // Cargar salas y dispositivos cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      checkPremiumStatus();
      refreshRoomsAndDevices();
    } else {
      // Limpiar datos al cerrar sesión
      setRooms([]);
      setRoomDevices({});
    }
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      setUser(null);
      setIsPremium(false);
    } catch (error) {
      console.log('Error deleting token on logout', error);
    }
  };

  const addRoom = async (name) => {
    if (!isPremium && rooms.length >= 2) {
      return false;
    }
    if (isPremium && rooms.length >= 100) {
      alert('Has alcanzado el límite de 100 salas.');
      return false;
    }
    try {
      const response = await api.post('/salas/', { name });
      const newRoom = response.data;
      setRooms(prev => [...prev, newRoom]);
      setRoomDevices(prev => ({ ...prev, [newRoom.id]: [] }));
      return true;
    } catch (error) {
      console.log('Error creando sala:', error.message);
      return false;
    }
  };

  const updateRoom = async (id, newName) => {
    try {
      const response = await api.patch(`/salas/${id}/`, { name: newName });
      setRooms(prev => prev.map(room => room.id === id ? response.data : room));
    } catch (error) {
      console.log('Error actualizando sala:', error.message);
    }
  };

  const deleteRoom = async (id) => {
    try {
      await api.delete(`/salas/${id}/`);
      setRooms(prev => prev.filter(room => room.id !== id));
      setRoomDevices(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.log('Error eliminando sala:', error.message);
    }
  };

  const addDeviceToRoom = async (roomId, deviceName) => {
    const currentDevices = roomDevices[roomId] || [];
    
    // Validar límites según el plan
    if (!isPremium && currentDevices.length >= 2) {
      alert('Límite alcanzado: Los usuarios gratuitos solo pueden tener 2 dispositivos por sala.');
      return false;
    }
    
    if (isPremium && currentDevices.length >= 50) {
      alert('Límite alcanzado: El plan Premium permite hasta 50 dispositivos por sala.');
      return false;
    }
    
    try {
      const response = await api.post('/dispositivos/', {
        name: deviceName,
        sala: roomId,
      });
      const newDevice = response.data;
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newDevice],
      }));
      return true;
    } catch (error) {
      console.log('Error agregando dispositivo:', error.message);
      return false;
    }
  };

  const updateDevice = async (roomId, deviceId, newName) => {
    try {
      const response = await api.patch(`/dispositivos/${deviceId}/`, { name: newName });
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: prev[roomId].map(device =>
          device.id === deviceId ? response.data : device
        ),
      }));
    } catch (error) {
      console.log('Error actualizando dispositivo:', error.message);
    }
  };

  const blockAllDevicesInRoom = async (roomId) => {
    if (roomDevices[roomId]) {
      try {
        const promises = roomDevices[roomId].map(device =>
          api.post(`/dispositivos/${device.id}/lock/`, { allow_emergency_calls: true })
        );
        await Promise.all(promises);
        setRoomDevices(prev => ({
          ...prev,
          [roomId]: prev[roomId].map(device => ({
            ...device,
            status: 'Bloqueado',
          })),
        }));
      } catch (error) {
        console.log('Error bloqueando dispositivos de la sala:', error.message);
      }
    }
  };

  const setDeviceSchedule = async (roomId, deviceId, schedule) => {
    try {
      const response = await api.patch(`/dispositivos/${deviceId}/`, { estimatedTime: schedule });
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: prev[roomId].map(device =>
          device.id === deviceId ? { ...device, estimatedTime: schedule } : device
        ),
      }));
    } catch (error) {
      console.log('Error configurando horario:', error.message);
    }
  };

  const deleteDevice = async (roomId, deviceId) => {
    try {
      await api.delete(`/dispositivos/${deviceId}/`);
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: prev[roomId].filter(device => device.id !== deviceId),
      }));
    } catch (error) {
      console.log('Error eliminando dispositivo:', error.message);
    }
  };

  const toggleDeviceStatus = async (roomId, deviceId, targetStatus) => {
    try {
      if (targetStatus === 'Bloqueado') {
        const response = await api.post(`/dispositivos/${deviceId}/lock/`, { allow_emergency_calls: true });
        if (response.status === 200) {
          setRoomDevices(prev => ({
            ...prev,
            [roomId]: prev[roomId].map(device =>
              device.id === deviceId ? { ...device, status: 'Bloqueado' } : device
            ),
          }));
        }
      } else {
        const response = await api.post(`/dispositivos/${deviceId}/unlock/`);
        if (response.status === 200) {
          setRoomDevices(prev => ({
            ...prev,
            [roomId]: prev[roomId].map(device =>
              device.id === deviceId ? { ...device, status: 'Activo' } : device
            ),
          }));
        }
      }
    } catch (error) {
      console.log('Error cambiando estado del dispositivo:', error.message);
      throw error; // Re-throw para que DeviceControlScreen pueda capturarlo
    }
  };

  const blockAllInRoom = async (roomId) => {
    try {
      const devices = roomDevices[roomId] || [];
      const promises = devices.map(device =>
        api.post(`/dispositivos/${device.id}/lock/`, { allow_emergency_calls: true })
      );
      await Promise.all(promises);
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: prev[roomId].map(device => ({ ...device, status: 'Bloqueado' })),
      }));
    } catch (error) {
      console.log('Error bloqueando todos los dispositivos:', error.message);
    }
  };

  const blockAllRooms = async () => {
    try {
      const allPromises = [];
      Object.keys(roomDevices).forEach(roomId => {
        roomDevices[roomId].forEach(device => {
          allPromises.push(api.post(`/dispositivos/${device.id}/lock/`, { allow_emergency_calls: true }));
        });
      });
      await Promise.all(allPromises);
      
      const newRoomDevices = { ...roomDevices };
      Object.keys(newRoomDevices).forEach(roomId => {
        newRoomDevices[roomId] = newRoomDevices[roomId].map(device => ({ ...device, status: 'Bloqueado' }));
      });
      setRoomDevices(newRoomDevices);
    } catch (error) {
      console.log('Error bloqueando todas las salas:', error.message);
    }
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
      logout,
      refreshRoomsAndDevices
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

