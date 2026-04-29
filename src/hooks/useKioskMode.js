import { useState, useEffect, useCallback } from 'react';
import { BackHandler, Alert, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { activateKeepAwakeAsync, deactivateKeepAwakeAsync, activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { hideAsync as hideStatusBar, showAsync as showStatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KIOSK_STORAGE_KEY = '@secure_lock:kiosk_active';

/**
 * Custom hook to enforce a "Kiosk Soft" mode.
 * Provides functions to activate/deactivate and manages system UI.
 */
export const useKioskMode = () => {
  const [isActive, setIsActive] = useState(false);

  // Check persistence on mount
  useEffect(() => {
    const checkPersistence = async () => {
      const stored = await AsyncStorage.getItem(KIOSK_STORAGE_KEY);
      if (stored === 'true') {
        setIsActive(true);
      }
    };
    checkPersistence();
  }, []);

  const activateKioskMode = useCallback(async () => {
    try {
      await AsyncStorage.setItem(KIOSK_STORAGE_KEY, 'true');
      setIsActive(true);
    } catch (error) {
      console.error('Failed to activate Kiosk Mode:', error);
    }
  }, []);

  const deactivateKioskMode = useCallback(async () => {
    try {
      await AsyncStorage.setItem(KIOSK_STORAGE_KEY, 'false');
      setIsActive(false);
    } catch (error) {
      console.error('Failed to deactivate Kiosk Mode:', error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const enableSystemLock = async () => {
      try {
        // 1. Keep Screen Awake (Safe call)
        try {
          if (typeof activateKeepAwakeAsync === 'function') {
            await activateKeepAwakeAsync();
          } else if (typeof activateKeepAwake === 'function') {
            activateKeepAwake();
          }
        } catch (e) {
          console.warn("No se pudo activar keep-awake:", e);
        }

        // 2. Hide Navigation Bar (Android)
        if (Platform.OS === 'android') {
          try {
            await NavigationBar.setVisibilityAsync('hidden');
            await NavigationBar.setBehaviorAsync('inset-touch'); 
          } catch (e) {
            console.warn("No se pudo ocultar NavigationBar (posible en Expo Go):", e);
          }
        }

        // 3. Hide Status Bar
        try {
          await hideStatusBar();
        } catch (e) {
          console.warn("No se pudo ocultar StatusBar:", e);
        }
      } catch (error) {
        console.error('Error applying Kiosk system settings:', error);
      }
    };

    const disableSystemLock = async () => {
      try {
        // Safe call to deactivate
        try {
          if (typeof deactivateKeepAwakeAsync === 'function') {
            await deactivateKeepAwakeAsync();
          } else if (typeof deactivateKeepAwake === 'function') {
            deactivateKeepAwake();
          }
        } catch (e) {
          console.warn("No se pudo desactivar keep-awake:", e);
        }

        if (Platform.OS === 'android') {
          try {
            await NavigationBar.setVisibilityAsync('visible');
          } catch (e) {
            console.warn("No se pudo restaurar NavigationBar:", e);
          }
        }
        
        try {
          await showStatusBar();
        } catch (e) {
          console.warn("No se pudo mostrar StatusBar:", e);
        }
      } catch (error) {
        console.error('Error restoring system settings:', error);
      }
    };

    if (isActive) {
      enableSystemLock();

      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        Alert.alert(
          'Dispositivo en uso',
          'El modo de seguridad está activo. No se puede salir de la aplicación.',
          [{ text: 'Entendido' }]
        );
        return true; 
      });

      return () => {
        backHandler.remove();
        if (isMounted) disableSystemLock();
      };
    } else {
      disableSystemLock();
    }

    return () => {
      isMounted = false;
    };
  }, [isActive]);

  return {
    isActive,
    activateKioskMode,
    deactivateKioskMode,
  };
};
