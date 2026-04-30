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
import * as SecureStore from 'expo-secure-store';
import { User, Mail, Lock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';
import CustomInput from '../components/CustomInput';
import { useAuth, useTheme } from '../context';
import api from '../services/api';

import logger from '../utils/logger';
import { validateEmail } from '../utils/validators';


const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const { setUser } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const performLogin = async (email, password) => {
    // 1. Login (correcto)
    const tokenResponse = await api.post('/auth/token/', {
      username: email,
      password,
    });

    const { access, refresh } = tokenResponse.data;

    await SecureStore.setItemAsync('userToken', access);
    if (refresh) {
      await SecureStore.setItemAsync('refreshToken', refresh);
    }

    // 2. 🔥 AQUÍ ESTABA EL PROBLEMA
    // Intentas llamar /users/me/ pero NO existe
    // Entonces hacemos fallback seguro:

    let userData = null;

    try {
      const profileResponse = await api.get('/users/me/');
      userData = profileResponse.data;
    } catch (e) {
      console.log('No existe /users/me/, usando fallback');

      // fallback mínimo para que no rompa la app
      userData = {
        email,
        username: email,
        full_name: email.split('@')[0],
      };
    }

    const normalizedUser = {
      ...userData,
      name:
        userData.full_name ||
        userData.name ||
        userData.username ||
        email.split('@')[0],
      avatar:
        userData.avatar ||
        userData.profile_image ||
        userData.photo ||
        null,
    };

    setUser(normalizedUser);
  };

  const handleSubmit = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        await performLogin(form.email, form.password);
      } else {
        // Validaciones locales con feedback inline
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = t('auth.error_name') || 'El nombre es obligatorio';
        if (!form.email.trim()) newErrors.email = t('auth.error_email') || 'El correo es obligatorio';
        else if (!validateEmail(form.email)) newErrors.email = t('auth.error_email_invalid') || 'Correo inválido';
        if (form.password.length < 6) newErrors.password = t('auth.error_pass_short') || 'Mínimo 6 caracteres';

        if (form.password !== form.confirmPassword) newErrors.confirmPassword = t('auth.error_pass_mismatch') || 'No coinciden';

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsLoading(false);
          return;
        }

        await SecureStore.deleteItemAsync('userToken');
        await api.post('/users/register/', {
          username: form.email,
          email: form.email,
          password: form.password,
          full_name: form.fullName.trim(),
        });

        await performLogin(form.email, form.password);
      }
      navigation.navigate('Home');
    } catch (error) {
      logger.log('[AUTH ERROR]', error.response?.data || error.message);

      const data = error.response?.data;
      const status = error.response?.status;
      let message = t('auth.error_generic') || 'Error de conexión';

      if (data) {
        if (typeof data === 'string') {
          message = data;
        } else if (data.detail || data.error) {
          message = data.detail || data.error;
        } else if (data.non_field_errors) {
          message = data.non_field_errors[0];
        } else if (data.username) {
          message = Array.isArray(data.username) ? data.username[0] : data.username;
        } else if (data.password) {
          message = Array.isArray(data.password) ? data.password[0] : data.password;
        } else if (data.email) {
          message = Array.isArray(data.email) ? data.email[0] : data.email;
        }
      }

      if (status === 400) {
        message = message || 'Datos inválidos. Revisa los campos.';
      } else if (status === 401) {
        message = message || 'Credenciales incorrectas. Revisa usuario y contraseña.';
      } else if (status === 404) {
        message = message || 'No se encontró el recurso en el servidor.';
      }

      Alert.alert(t('common.error'), message);
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
      <View style={[styles.overlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(26, 31, 54, 0.4)' }]} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoContainer, SHADOWS.large]}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>{t('auth.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
          </View>

          {/* Auth Card */}
          <View style={[styles.card, { backgroundColor: themeColors.surface }, SHADOWS.large]}>
            {/* Tabs */}
            <View style={[styles.tabContainer, { backgroundColor: isDark ? '#2D3748' : '#F7FAFC' }]}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, { color: activeTab === 'login' ? '#FFF' : themeColors.textSecondary }]}>
                  {t('common.login')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                onPress={() => setActiveTab('register')}
              >
                <Text style={[styles.tabText, { color: activeTab === 'register' ? '#FFF' : themeColors.textSecondary }]}>
                  {t('common.register')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {activeTab === 'register' && (
                <CustomInput
                  label={t('auth.fullName')}
                  placeholder="Juan Pérez"
                  icon={User}
                  value={form.fullName}
                  onChangeText={(val) => handleInputChange('fullName', val)}
                  error={errors.fullName}
                />
              )}

              <CustomInput
                label={t('auth.email')}
                placeholder="tu@email.com"
                icon={Mail}
                value={form.email}
                onChangeText={(val) => handleInputChange('email', val)}
                keyboardType="email-address"
                error={errors.email}
              />

              <CustomInput
                label={t('auth.password')}
                placeholder="........"
                icon={Lock}
                secureTextEntry
                value={form.password}
                onChangeText={(val) => handleInputChange('password', val)}
                error={errors.password}
              />

              {activeTab === 'register' && (
                <CustomInput
                  label={t('auth.confirmPassword')}
                  placeholder="........"
                  icon={Lock}
                  secureTextEntry
                  value={form.confirmPassword}
                  onChangeText={(val) => handleInputChange('confirmPassword', val)}
                  error={errors.confirmPassword}
                />
              )}

              <TouchableOpacity 
                style={[styles.button, isLoading && { opacity: 0.8 }]} 
                onPress={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    width: '100%',
    borderRadius: 32,
    padding: SPACING.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    padding: 6,
    marginBottom: SPACING.xl,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    ...SHADOWS.medium,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default AuthScreen;
