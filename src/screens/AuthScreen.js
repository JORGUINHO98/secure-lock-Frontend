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
  Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { COLORS, SPACING } from '../theme/colors';
import CustomInput from '../components/CustomInput';

const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('register'); // Default to 'register' to match the image
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (activeTab === 'login') {
      console.log('Login with:', form.email, form.password);
    } else {
      console.log('Register with:', form);
    }
    // Navigate to Home for demo
    navigation.navigate('Home');
  };

  return (
    <ImageBackground 
      source={require('../assets/images/background.png')} 
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
              source={require('../assets/images/logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>SECURE LOCK</Text>
            <Text style={styles.subtitle}>control parental inteligente para dispositivos</Text>
          </View>

          {/* Auth Card */}
          <View style={styles.card}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'login' && styles.activeTab]} 
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Iniciar Sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'register' && styles.activeTab]} 
                onPress={() => setActiveTab('register')}
              >
                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {activeTab === 'register' && (
                <CustomInput
                  label="Nombre Completo"
                  placeholder="Juan Pérez"
                  icon={User}
                  value={form.fullName}
                  onChangeText={(val) => handleInputChange('fullName', val)}
                />
              )}

              <CustomInput
                label="Email"
                placeholder="tu@email.com"
                icon={Mail}
                value={form.email}
                onChangeText={(val) => handleInputChange('email', val)}
                keyboardType="email-address"
              />

              <CustomInput
                label="Contraseña"
                placeholder="........"
                icon={Lock}
                secureTextEntry
                value={form.password}
                onChangeText={(val) => handleInputChange('password', val)}
              />

              {activeTab === 'register' && (
                <CustomInput
                  label="Confirmar Contraseña"
                  placeholder="........"
                  icon={Lock}
                  secureTextEntry
                  value={form.confirmPassword}
                  onChangeText={(val) => handleInputChange('confirmPassword', val)}
                />
              )}

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                  {activeTab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </Text>
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
