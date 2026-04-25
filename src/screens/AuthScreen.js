import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as SecureStore from 'expo-secure-store';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING } from '../theme/colors';
import CustomInput from '../components/CustomInput';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';

const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const { setUser } = useAppContext();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('register'); // Default to 'register' to match the image
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  // Helper: realiza login real contra la API y configura el usuario
  const performLogin = async (email, password) => {
    // 1. Obtener token JWT
    const tokenResponse = await api.post('/auth/token/', { email, password });
    const { access } = tokenResponse.data;
    await SecureStore.setItemAsync('userToken', access);

    // 2. Obtener perfil del usuario
    const profileResponse = await api.get('/users/me/');
    const userData = profileResponse.data;

    // 3. Normalizar el nombre e imagen: el backend puede devolver full_name, avatar, etc.
    const normalizedUser = {
      ...userData,
      name: userData.full_name || userData.name || userData.username || email.split('@')[0],
      avatar: userData.avatar || userData.profile_image || userData.photo || null
    };

    setUser(normalizedUser);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        // Login real
        await performLogin(form.email, form.password);
      } else {
        // Validaciones locales
        if (!form.fullName.trim()) {
          Alert.alert('Error', 'El nombre completo es obligatorio.');
          setIsLoading(false);
          return;
        }
        if (!form.email.trim()) {
          Alert.alert('Error', 'El correo electrónico es obligatorio.');
          setIsLoading(false);
          return;
        }
        if (form.password.length < 6) {
          Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
          setIsLoading(false);
          return;
        }
        if (form.password !== form.confirmPassword) {
          Alert.alert('Error', 'Las contraseñas no coinciden.');
          setIsLoading(false);
          return;
        }

        // Limpiar cualquier token residual antes de registrar
        await SecureStore.deleteItemAsync('userToken');

        console.log('[REGISTRO] Enviando payload:', {
          full_name: form.fullName,
          email: form.email,
          password: '***',
        });

        await api.post('/users/register/', {
          full_name: form.fullName,
          email: form.email,
          password: form.password,
        });

        console.log('[REGISTRO] Éxito, iniciando auto-login...');
        // Auto-login después del registro exitoso
        await performLogin(form.email, form.password);
      }
      navigation.navigate('Home');
    } catch (error) {
      // Log completo para debug
      console.log('[AUTH ERROR] Status:', error.response?.status);
      console.log('[AUTH ERROR] Data:', JSON.stringify(error.response?.data));
      console.log('[AUTH ERROR] URL:', error.config?.url);

      const data = error.response?.data;
      let message = 'Error de conexión. Verifica tu red e inténtalo de nuevo.';

      if (data) {
        if (data.detail) {
          message = data.detail;
        } else if (data.error) {
          message = data.error;
        } else if (data.email) {
          // Campo específico del serializador DRF
          message = `Correo: ${Array.isArray(data.email) ? data.email[0] : data.email}`;
        } else if (data.password) {
          message = `Contraseña: ${Array.isArray(data.password) ? data.password[0] : data.password}`;
        } else if (data.full_name) {
          message = `Nombre: ${Array.isArray(data.full_name) ? data.full_name[0] : data.full_name}`;
        } else if (data.non_field_errors) {
          message = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
        } else {
          // Mostrar la primera clave del objeto de error
          const firstKey = Object.keys(data)[0];
          if (firstKey) {
            const val = data[firstKey];
            message = `${firstKey}: ${Array.isArray(val) ? val[0] : val}`;
          } else {
            message = JSON.stringify(data);
          }
        }
      }

      Alert.alert('Error al registrarse', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo and Title */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>{t('auth.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
          </View>

          {/* Auth Card */}
          <View style={styles.card}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>{t('common.login')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                onPress={() => setActiveTab('register')}
              >
                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>{t('common.register')}</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {activeTab === 'register' && (
                <CustomInput
                  label={t('auth.fullName')}
                  placeholder="Juan Pérez"
                  icon={User}
                  value={form.fullName}
                  onChangeText={(val) => handleInputChange('fullName', val)}
                />
              )}

              <CustomInput
                label={t('auth.email')}
                placeholder="tu@email.com"
                icon={Mail}
                value={form.email}
                onChangeText={(val) => handleInputChange('email', val)}
                keyboardType="email-address"
              />

              <CustomInput
                label={t('auth.password')}
                placeholder="........"
                icon={Lock}
                secureTextEntry
                value={form.password}
                onChangeText={(val) => handleInputChange('password', val)}
              />

              {activeTab === 'register' && (
                <CustomInput
                  label={t('auth.confirmPassword')}
                  placeholder="........"
                  icon={Lock}
                  secureTextEntry
                  value={form.confirmPassword}
                  onChangeText={(val) => handleInputChange('confirmPassword', val)}
                />
              )}

              {/* Submit Button */}
              <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={COLORS.background.white} />
                ) : (
                  <Text style={styles.buttonText}>
                    {activeTab === 'login' ? t('common.login') : t('auth.createAccount')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E234C', // Dark blue/purple from image
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.muted,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  form: {
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.background.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
