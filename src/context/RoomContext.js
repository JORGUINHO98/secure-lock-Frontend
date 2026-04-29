import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';
import logger from '../utils/logger';

const RoomContext = createContext();

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = useCallback(async () => {
    try {
      const response = await api.get('/salas/');
      setRooms(response.data);
      return response.data;
    } catch (error) {
      logger.log('Error cargando salas:', error.message);
      return [];
    }
  }, []);

  const addRoom = async (name, isPremium, currentRoomsCount) => {
    if (!isPremium && currentRoomsCount >= 2) {
      return false;
    }
    if (isPremium && currentRoomsCount >= 100) {
      alert('Has alcanzado el límite de 100 salas.');
      return false;
    }
    try {
      const response = await api.post('/salas/', { name });
      const newRoom = response.data;
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (error) {
      logger.log('Error creando sala:', error.message);
      return false;
    }
  };

  const updateRoom = async (id, newName) => {
    try {
      const response = await api.patch(`/salas/${id}/`, { name: newName });
      setRooms(prev => prev.map(room => room.id === id ? response.data : room));
      return true;
    } catch (error) {
      logger.log('Error actualizando sala:', error.message);
      return false;
    }
  };

  const deleteRoom = async (id) => {
    try {
      await api.delete(`/salas/${id}/`);
      setRooms(prev => prev.filter(room => room.id !== id));
      return true;
    } catch (error) {
      logger.log('Error eliminando sala:', error.message);
      return false;
    }
  };

  return (
    <RoomContext.Provider value={{
      rooms,
      setRooms,
      fetchRooms,
      addRoom,
      updateRoom,
      deleteRoom
    }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomContext };

