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
import { validateEmail, validatePassword, validateRole } from '../utils/validators';


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
    role: 'CREATOR',
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
    const tokenResponse = await api.post('/auth/token/', {
      email,
      password,
    });

    const { access, refresh } = tokenResponse.data;

    await SecureStore.setItemAsync('userToken', access);
    if (refresh) {
      await SecureStore.setItemAsync('refreshToken', refresh);
    }

    let userData = null;

    try {
      const profileResponse = await api.get('/users/me/');
      userData = profileResponse.data;
    } catch (e) {
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

  const registerUser = async () => {
    const payload = {
      email: form.email,
      password: form.password,
      full_name: form.fullName.trim(),
      role: form.role,
    };

    const response = await api.post('/users/register/', payload);
    return response.data;
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
        if (form.fullName.trim() && form.fullName.trim().length < 2) {
          newErrors.fullName = t('auth.error_name_short') || 'El nombre debe tener al menos 2 caracteres';
        }
        if (!form.email.trim()) newErrors.email = t('auth.error_email') || 'El correo es obligatorio';
        else if (!validateEmail(form.email)) newErrors.email = t('auth.error_email_invalid') || 'Correo inválido';
        else if (form.email.trim().length > 255) newErrors.email = t('auth.error_email_length') || 'El email no puede superar 255 caracteres';
        if (!validatePassword(form.password)) newErrors.password = t('auth.error_pass_requirements') || 'Mínimo 8 caracteres y debe incluir letras y números';
        if (!validateRole(form.role)) newErrors.role = t('auth.error_role_invalid') || 'Rol inválido';

        if (form.password !== form.confirmPassword) newErrors.confirmPassword = t('auth.error_pass_mismatch') || 'No coinciden';

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsLoading(false);
          return;
        }

        await SecureStore.deleteItemAsync('userToken');
        const registerData = await registerUser();

        if (registerData?.tokens?.access) {
          await SecureStore.setItemAsync('userToken', registerData.tokens.access);
          if (registerData.tokens.refresh) {
            await SecureStore.setItemAsync('refreshToken', registerData.tokens.refresh);
          }
          if (registerData.user) {
            setUser({
              ...registerData.user,
              name: registerData.user.full_name || registerData.user.email?.split('@')[0] || 'Usuario',
              avatar: registerData.user.avatar || null,
            });
          } else {
            await performLogin(form.email, form.password);
          }
        } else {
          await performLogin(form.email, form.password);
        }
      }
      navigation.navigate('Home');
    } catch (error) {
      logger.log('[AUTH ERROR]', error.response?.data || error.message);

      const data = error.response?.data;
      const status = error.response?.status;
      let message = t('auth.error_generic') || 'Error de conexión';

      if (data) {
        if (data.errors && typeof data.errors === 'object') {
          const mappedErrors = {};
          Object.entries(data.errors).forEach(([field, value]) => {
            const normalizedField = field === 'full_name' ? 'fullName' : field;
            mappedErrors[normalizedField] = Array.isArray(value) ? value[0] : value;
          });
          setErrors(mappedErrors);
          const firstError = Object.values(mappedErrors)[0];
          if (firstError) message = firstError;
        } else if (typeof data === 'string') {
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
                <View style={styles.roleSection}>
                  <Text style={[styles.roleLabel, { color: themeColors.text }]}>{t('auth.role') || 'Rol'}</Text>
                  <View style={[styles.roleContainer, { backgroundColor: isDark ? '#2D3748' : '#F7FAFC' }]}>
                    <TouchableOpacity
                      style={[styles.roleButton, form.role === 'CREATOR' && styles.activeRoleButton]}
                      onPress={() => handleInputChange('role', 'CREATOR')}
                    >
                      <Text style={[styles.roleButtonText, { color: form.role === 'CREATOR' ? '#FFF' : themeColors.textSecondary }]}>
                        CREATOR
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.roleButton, form.role === 'TARGET' && styles.activeRoleButton]}
                      onPress={() => handleInputChange('role', 'TARGET')}
                    >
                      <Text style={[styles.roleButtonText, { color: form.role === 'TARGET' ? '#FFF' : themeColors.textSecondary }]}>
                        TARGET
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {errors.role ? <Text style={styles.roleError}>{errors.role}</Text> : null}
                </View>
              )}
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
  roleSection: {
    marginBottom: SPACING.md,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  roleContainer: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 14,
    padding: 5,
  },
  roleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  activeRoleButton: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  roleError: {
    color: '#EF4444',
    marginTop: 6,
    fontSize: 12,
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
