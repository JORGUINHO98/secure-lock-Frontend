import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  Platform,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SecureStore from 'expo-secure-store';
import { Shield, Lock, Smartphone, RefreshCw, Unlock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { COLORS } from '../theme/colors';
import socketService from '../services/socket';
import { useKioskMode } from '../hooks/useKioskMode';



const { width } = Dimensions.get('window');

const TargetLockScreen = ({ navigation }) => {
  const { theme } = useAppContext();
  const { t } = useTranslation();
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceId, setDeviceId] = useState(null);
  const [tapCount, setTapCount] = useState(0);

  // Use the Kiosk Mode hook
  const { isActive: kioskActive, activateKioskMode, deactivateKioskMode } = useKioskMode();

  // Sync Kiosk mode with lock status from server
  useEffect(() => {
    if (isLocked) {
      activateKioskMode();
    }
  }, [isLocked, activateKioskMode]);

  // Handle secret gesture (5 taps) to exit Kiosk mode
  const handleSecretGesture = () => {
    const newCount = tapCount + 1;
    if (newCount >= 5) {
      deactivateKioskMode();
      setTapCount(0);
      Alert.alert("Admin", "Modo Kiosk desactivado manualmente.");
    } else {
      setTapCount(newCount);
      // Reset count after 2 seconds of inactivity
      setTimeout(() => setTapCount(0), 2000);
    }
  };




  useEffect(() => {
    const setupConnection = async () => {
      try {
        const storedId = await SecureStore.getItemAsync('device_unique_id');
        const token = await SecureStore.getItemAsync('userToken');
        
        if (storedId) {
          setDeviceId(storedId);
          
          socketService.connect(storedId, token, (message) => {
            if (message.type === 'device.status') {
              const { action, is_locked } = message.payload;
              setIsLocked(is_locked);
            }
          });
        }
      } catch (error) {
        console.error("Socket connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setupConnection();

    return () => {
      socketService.disconnect();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isLocked ? styles.lockedContainer : styles.unlockedContainer]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {!isLocked ? (
          <View style={styles.statusView}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={handleSecretGesture}
              style={styles.iconContainer}
            >
              <View style={[styles.glowCircle, { backgroundColor: 'rgba(0, 230, 118, 0.1)' }]}>
                <Unlock size={100} color={COLORS.green} />
              </View>
            </TouchableOpacity>
            <Text style={styles.brandTitle}>Secure Lock</Text>

            <Text style={styles.statusText}>{t('lock.device_free') || "Dispositivo Libre"}</Text>
            <View style={styles.remoteIndicator}>
              <Text style={styles.remoteText}>{t('lock.waiting') || "ESPERANDO ÓRDENES..."}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.statusView}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={handleSecretGesture}
              style={styles.iconContainer}
            >
              <View style={[styles.glowCircle, { backgroundColor: 'rgba(255, 49, 49, 0.1)' }]}>
                <Lock size={100} color={COLORS.red} />
              </View>
            </TouchableOpacity>
            <Text style={styles.brandTitle}>Secure Lock</Text>

            <Text style={styles.statusText}>{t('lock.device_locked') || "DISPOSITIVO BLOQUEADO"}</Text>
            <View style={[styles.remoteIndicator, { backgroundColor: COLORS.red }]}>
              <Text style={styles.remoteText}>{t('lock.protection_active') || "PROTECCIÓN ACTIVA"}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Lock Mode Indicator */}
      {kioskActive && (
        <View style={styles.lockIndicator}>
          <Lock size={14} color="#FF3B30" />
        </View>
      )}

    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  unlockedContainer: {
    backgroundColor: '#000',
  },
  lockedContainer: {
    backgroundColor: '#1a0000', // Un negro rojizo muy oscuro y premium
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  statusView: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: 50,
  },
  glowCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  statusText: {
    fontSize: 20,
    color: '#AAA',
    marginBottom: 40,
    fontWeight: '500',
  },
  remoteIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  remoteText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  lockIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    zIndex: 999,
  },
});


export default TargetLockScreen;
