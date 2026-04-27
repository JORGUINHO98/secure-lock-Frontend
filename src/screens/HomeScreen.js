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
          <Menu size={32} color={COLORS.text.white} />
        </TouchableOpacity>
        <Text style={[styles.welcomeText, { color: COLORS.text.white }]}>{t('home.welcome_user', { name: user?.name || user?.full_name || user?.username || user?.email?.split('@')[0] || t('common.user') })}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={28} color={COLORS.text.white} />
        </TouchableOpacity>
      </View>

      <ImageBackground
        source={isDark ? null : require('../../assets/background.png')}
        style={[styles.background, { backgroundColor: isDark ? '#1A1A1A' : COLORS.background.main }]}
        resizeMode="cover"
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
          <View style={styles.content}>

            {/* Logo and Title Section */}
            <View style={styles.heroSection}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[styles.title, { color: isDark ? COLORS.accent : COLORS.secondary }]}>{t('auth.title')}</Text>
              <Text style={[styles.subtitle, { color: isDark ? COLORS.text.secondary : COLORS.text.main }]}>{t('home.hero_subtitle')}</Text>
            </View>

            {/* Action Cards */}
            <View style={styles.actionContainer}>
              <ActionCard
                title={t('home.scan_qr')}
                subtitle={t('home.scan_qr_sub')}
                icon={Smartphone}
                onPress={() => navigation.navigate('CameraScanner')}
              />
              <ActionCard
                title={t('home.control_devices')}
                icon={Shield}
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
          <View style={[styles.menuContent, { backgroundColor: isDark ? COLORS.secondary : COLORS.background.surface }]}>
            <View style={styles.menuHeader}>
              <Text style={[styles.menuTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Menú</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <X size={32} color={isDark ? COLORS.text.white : COLORS.text.main} />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert("Premium", "Redirigiendo..."); }}>
                <CreditCard size={24} color={COLORS.primary} />
                <Text style={[styles.menuItemText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Adquirir Plan Premium</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Account'); }}>
                <User size={24} color={COLORS.primary} />
                <Text style={[styles.menuItemText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Cuenta del Usuario</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleLogout(); }}>
                <LogOut size={24} color={COLORS.status.locked} />
                <Text style={[styles.menuItemText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: COLORS.background.surface }]}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={28} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary }]}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={28} color={COLORS.secondary} />
          <Text style={[styles.navText, { color: COLORS.secondary }]}>{t('common.rooms')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={28} color={COLORS.secondary} />
          <Text style={[styles.navText, { color: COLORS.secondary }]}>{t('common.account')}</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 8,
    borderRadius: 20,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  themeToggle: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 8,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 3.5,
    textTransform: 'capitalize',
  },
  subtitle: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    paddingTop: SPACING.lg,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 90,
    backgroundColor: COLORS.background.surface,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
  },
  menuCloseArea: {
    flex: 1,
  },
  menuContent: {
    width: width * 0.75,
    height: '100%',
    padding: SPACING.lg,
    paddingTop: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  }
});

export default HomeScreen;
