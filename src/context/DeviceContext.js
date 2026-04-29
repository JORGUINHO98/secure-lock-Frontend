import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import logger from '../utils/logger';

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [roomDevices, setRoomDevices] = useState({}); // { roomId: [devices] }

  const fetchDevices = useCallback(async (rooms) => {
    try {
      const response = await api.get('/dispositivos/');
      const devices = response.data;
      
      const grouped = {};
      if (rooms) {
        rooms.forEach(sala => {
          grouped[sala.id] = [];
        });
      }
      
      devices.forEach(device => {
        const salaId = device.sala || device.room;
        if (salaId) {
          if (!grouped[salaId]) grouped[salaId] = [];
          grouped[salaId].push(device);
        }
      });
      
      setRoomDevices(grouped);
      return grouped;
    } catch (error) {
      logger.log('Error cargando dispositivos:', error.message);
      return {};
    }
  }, []);

  const addDeviceToRoom = async (roomId, deviceName, isPremium, currentDevicesCount) => {
    if (!isPremium && currentDevicesCount >= 2) {
      alert('Límite alcanzado: Los usuarios gratuitos solo pueden tener 2 dispositivos por sala.');
      return false;
    }
    
    if (isPremium && currentDevicesCount >= 50) {
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
      logger.log('Error agregando dispositivo:', error.message);
      return false;
    }
  };

  const updateDevice = async (roomId, deviceId, newName) => {
    try {
      const response = await api.patch(`/dispositivos/${deviceId}/`, { name: newName });
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).map(device =>
          device.id === deviceId ? response.data : device
        ),
      }));
      return true;
    } catch (error) {
      logger.log('Error actualizando dispositivo:', error.message);
      return false;
    }
  };

  const deleteDevice = async (roomId, deviceId) => {
    try {
      await api.delete(`/dispositivos/${deviceId}/`);
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).filter(device => device.id !== deviceId),
      }));
      return true;
    } catch (error) {
      logger.log('Error eliminando dispositivo:', error.message);
      return false;
    }
  };

  const toggleDeviceStatus = async (roomId, deviceId, targetStatus) => {
    // Optimistic update
    const previousDevices = roomDevices[roomId];
    setRoomDevices(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).map(device =>
        device.id === deviceId ? { ...device, status: targetStatus === 'Bloqueado' ? 'Bloqueado' : 'Activo' } : device
      ),
    }));

    try {
      if (targetStatus === 'Bloqueado') {
        await api.post(`/dispositivos/${deviceId}/lock/`, { allow_emergency_calls: true });
      } else {
        await api.post(`/dispositivos/${deviceId}/unlock/`);
      }
      return true;
    } catch (error) {
      logger.log('Error cambiando estado del dispositivo (reversionando):', error.message);
      
      // Rollback
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: previousDevices,
      }));
      
      throw error;
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
        [roomId]: (prev[roomId] || []).map(device => ({ ...device, status: 'Bloqueado' })),
      }));
      return true;
    } catch (error) {
      logger.log('Error bloqueando todos los dispositivos de la sala:', error.message);
      return false;
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
      return true;
    } catch (error) {
      logger.log('Error bloqueando todas las salas:', error.message);
      return false;
    }
  };

  const setDeviceSchedule = async (roomId, deviceId, schedule) => {
    try {
      await api.patch(`/dispositivos/${deviceId}/`, { estimatedTime: schedule });
      setRoomDevices(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).map(device =>
          device.id === deviceId ? { ...device, estimatedTime: schedule } : device
        ),
      }));
      return true;
    } catch (error) {
      logger.log('Error configurando horario:', error.message);
      return false;
    }
  };

  return (
    <DeviceContext.Provider value={{
      roomDevices,
      setRoomDevices,
      fetchDevices,
      addDeviceToRoom,
      updateDevice,
      deleteDevice,
      toggleDeviceStatus,
      blockAllInRoom,
      blockAllRooms,
      setDeviceSchedule
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export { DeviceContext };

