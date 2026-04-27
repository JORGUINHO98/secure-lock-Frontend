import React, { useState } from 'react';
import { Platform, View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Alert,
  ScrollView } from 'react-native';
import {
  Menu,
  LogOut,
  Shield,
  Smartphone,
  Home,
  Users,
  User,
  SunMoon,
  CreditCard,
  Settings,
  X
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING } from '../theme/colors';
import ActionCard from '../components/ActionCard';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme, logout, user } = useAppContext();
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);
  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: () => {
          logout();
          navigation.navigate('Auth');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.secondary }]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Menu size={28} color={COLORS.text.white} />
        </TouchableOpacity>
        <Text style={[styles.welcomeText, { color: COLORS.text.white }]}>{t('home.welcome_user', { name: user?.name || user?.full_name || user?.username || user?.email?.split('@')[0] || t('common.user') })}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color={COLORS.text.white} />
        </TouchableOpacity>
      </View>

      <ImageBackground
        source={require('../../assets/background.png')}
        style={[styles.background, { backgroundColor: isDark ? '#0D1120' : COLORS.background.main }]}
        resizeMode="cover"
      >
        {/* Dark overlay for improved text legibility */}
        <View style={styles.backgroundOverlay} />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.content}>

            {/* Logo and Title Section */}
            <View style={styles.heroSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>{t('auth.title')}</Text>
              <Text style={styles.subtitle}>{t('home.hero_subtitle')}</Text>
            </View>

            {/* Action Cards */}
            <View style={styles.actionContainer}>
              <ActionCard
                title={t('home.scan_qr')}
                subtitle={t('home.scan_qr_sub')}
                icon={Smartphone}
                variant="primary"
                onPress={() => navigation.navigate('CameraScanner')}
              />
              <ActionCard
                title={t('home.control_devices')}
                icon={Shield}
                variant="secondary"
                onPress={() => navigation.navigate('Rooms')}
              />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>

      {/* Hamburger Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="fade">
        <View style={styles.menuOverlay}>
          <TouchableOpacity style={styles.menuCloseArea} onPress={() => setMenuVisible(false)} />
          <View style={[styles.menuContent, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Menú</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.menuCloseBtn}>
                <X size={24} color={isDark ? COLORS.text.white : COLORS.text.main} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Premium'); }}>
                <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(0, 106, 255, 0.1)' }]}>
                  <CreditCard size={20} color={COLORS.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Adquirir Plan Premium</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Account'); }}>
                <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(0, 106, 255, 0.1)' }]}>
                  <User size={20} color={COLORS.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Cuenta del Usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Settings'); }}>
                <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(0, 106, 255, 0.1)' }]}>
                  <Settings size={20} color={COLORS.primary} />
                </View>
                <Text style={[styles.menuItemText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Configuración</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => { setMenuVisible(false); handleLogout(); }}>
                <View style={[styles.menuIconCircle, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                  <LogOut size={20} color={COLORS.status.locked} />
                </View>
                <Text style={[styles.menuItemText, { color: COLORS.status.locked }]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={28} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary }]}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>{t('common.rooms')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>{t('common.account')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.secondary,
  },
  welcomeText: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 10,
    borderRadius: 22,
  },
  background: {
    flex: 1,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 31, 54, 0.55)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SPACING.sm,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  actionContainer: {
    width: '100%',
    paddingTop: SPACING.md,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 90,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
  },
  menuCloseArea: {
    flex: 1,
  },
  menuContent: {
    width: width * 0.78,
    height: '100%',
    padding: SPACING.lg,
    paddingTop: 60,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  menuCloseBtn: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    padding: 8,
    borderRadius: 20,
  },
  menuTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.md,
  }
});

export default HomeScreen;
