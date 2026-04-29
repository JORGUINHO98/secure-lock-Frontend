import React, { useState, useCallback, memo } from 'react';

import { Platform, View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
  ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Menu,
  LogOut,
  Shield,
  Smartphone,
  Home,
  Users,
  User,
  CreditCard,
  Settings,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';
import ActionCard from '../components/ActionCard';
import Header from '../components/Header';
import CustomModal from '../components/CustomModal';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, logout, user } = useAppContext();
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('home.logout_title') || "Cerrar Sesión",
      t('home.logout_confirm') || "¿Estás seguro que quieres salir?",
      [
        { text: t('common.cancel') || "Cancelar", style: "cancel" },
        { text: t('CERRAR SESIÓN') || "Salir", style: "destructive", onPress: () => {
          logout();
          navigation.navigate('Auth');
        }}
      ]
    );
  }, [t, logout, navigation]);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? themeColors.background : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />



      <ImageBackground
        source={require('../../assets/background.png')}
        style={[styles.background, { backgroundColor: themeColors.background }]}
        resizeMode="cover"
      >
        <View style={[styles.backgroundOverlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(26, 31, 54, 0.7)' }]} />

        <Header 
          title={`Bienvenido: ${user?.name?.split(' ')[0] || 'Usuario'}`}
          showMenu
          onMenu={() => setMenuVisible(true)}
          isDark
          transparent
          rightElement={
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.content}>

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={[styles.logoContainer, SHADOWS.large]}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>SECURE LOCK</Text>
            </View>

            {/* Action Cards Container */}
            <View style={styles.actionBox}>
              <ActionCard
                title={t('home.scan_qr') || "ESCANEAR QR"}
                subtitle={t('home.scan_qr_sub') || "Vincular este dispositivo a una sala"}
                icon={Smartphone}
                variant="primary"
                onPress={() => navigation.navigate('CameraScanner')}
              />
              <ActionCard
                title={t('home.control_devices') || "CONTROLAR DISPOSITIVOS"}
                subtitle={t('home.control_devices_sub') || "Gestiona y asegura tus salas"}
                icon={Shield}
                variant="secondary"
                onPress={() => navigation.navigate('Rooms')}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Modern Menu Modal */}
      <CustomModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        title="Menú"
      >
        <View style={styles.menuItems}>
          <MenuItem 
            icon={CreditCard} 
            label="Adquirir Plan Premium" 
            onPress={() => { setMenuVisible(false); navigation.navigate('Premium'); }}
            isDark={isDark}
          />
          <MenuItem 
            icon={User} 
            label="Cuenta del Usuario" 
            onPress={() => { setMenuVisible(false); navigation.navigate('Account'); }}
            isDark={isDark}
          />
          <MenuItem 
            icon={Settings} 
            label="Configuración" 
            onPress={() => { setMenuVisible(false); navigation.navigate('Settings'); }}
            isDark={isDark}
          />
          <MenuItem 
            icon={LogOut} 
            label="Cerrar Sesión" 
            onPress={() => { setMenuVisible(false); handleLogout(); }}
            isDark={isDark}
            isDestructive
          />
        </View>
      </CustomModal>

      {/* Bottom Navigation */}
      <View style={[
        styles.bottomNav, 
        { 
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border 
        }
      ]}>
        <NavButton icon={Home} label={t('common.home') || "Inicio"} active isDark={isDark} />
        <NavButton 
          icon={Users} 
          label={t('common.rooms') || "Salas"} 
          onPress={() => navigation.navigate('Rooms')} 
          isDark={isDark}
        />
        <NavButton 
          icon={User} 
          label={t('common.account') || "Cuenta"} 
          onPress={() => navigation.navigate('Account')} 
          isDark={isDark}
        />
      </View>
    </SafeAreaView>
  );
};

const MenuItem = memo(({ icon: Icon, label, onPress, isDark, isDestructive }) => {
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[
        styles.menuIconCircle, 
        { backgroundColor: isDestructive ? 'rgba(255, 59, 48, 0.1)' : COLORS.primaryLight }
      ]}>
        <Icon size={20} color={isDestructive ? COLORS.status.locked : COLORS.primary} />
      </View>
      <Text style={[
        styles.menuItemText, 
        { color: isDestructive ? COLORS.status.locked : themeColors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
});


const NavButton = memo(({ icon: Icon, label, active, onPress, isDark }) => {
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  const color = active ? COLORS.primary : themeColors.textSecondary;
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Icon size={24} color={color} strokeWidth={active ? 2.5 : 2} />
      <Text style={[styles.navText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    borderRadius: 12,
  },
  background: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  actionBox: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  bottomNav: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 90 : 70,
    borderTopWidth: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    width: width / 3,
  },
  navText: {
    ...TYPOGRAPHY.small,
    marginTop: 4,
    fontWeight: '600',
  },
  menuItems: {
    gap: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  menuItemText: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  }
});

export default HomeScreen;
