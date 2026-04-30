import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import * as SecureStore from 'expo-secure-store';
import logger from '../utils/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Normalizar el nombre y la imagen del usuario
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
    
    const avatar = userData.avatar || userData.profile_image || userData.photo || userData.image || null;
    
    return { ...userData, name, avatar };
  };

  const checkPremiumStatus = async () => {
    if (!user) return;
    try {
      const response = await api.get('/suscripciones/premium-status/');
      setIsPremium(response.data.has_active_premium);
    } catch (error) {
      logger.log('Verificación premium fallida (posiblemente offline o endpoint inexistente)');
    }
  };

  // Carga inicial
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync('userData');
        const token = await SecureStore.getItemAsync('userToken');

        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUser(normalizeUserName(parsed));
        }

        if (token) {
          try {
            const profileResponse = await api.get('/users/me/');
            const serverData = normalizeUserName(profileResponse.data);
            
            // Combinar con datos locales para el avatar si el server no lo trae
            const finalAvatar = serverData.avatar || (savedUser ? JSON.parse(savedUser).avatar : null);
            setUser({ ...serverData, avatar: finalAvatar });
          } catch (err) {
            logger.log('No se pudo refrescar el perfil del usuario:', err.message);
          }
        }
      } catch (error) {
        logger.log('Error cargando usuario de SecureStore', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadUser();
  }, []);

  // Guardar usuario cuando cambie
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
        logger.log('Error guardando usuario en SecureStore', error);
      }
    };
    saveUser();
  }, [user, isInitialized]);

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
      setIsPremium(false);
    } catch (error) {
      logger.log('Error deleting token on logout', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isPremium,
      setIsPremium,
      isInitialized,
      checkPremiumStatus,
      logout,
      normalizeUserName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

