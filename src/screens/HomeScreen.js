import React, { useState } from 'react';
import { 
  View, 
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
  ScrollView
} from 'react-native';
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
import { COLORS, SPACING } from '../theme/colors';
import ActionCard from '../components/ActionCard';
import { useAppContext } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme, logout, user } = useAppContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert(
        "Cerrar Sesión",
        "¿Estás seguro que quieres salir?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: () => logout() }
        ]
      );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#A8C3C0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#A8C3C0' }]}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Menu size={32} color={isDark ? '#FFF' : '#1E234C'} />
        </TouchableOpacity>
        <Text style={[styles.welcomeText, { color: isDark ? '#FFF' : '#000' }]}>Bienvenido: {user?.name || 'Admin'}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ImageBackground 
        source={isDark ? null : require('../assets/images/background.png')} 
        style={[styles.background, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}
        resizeMode="cover"
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.content}>
            {/* Theme Toggle Overlay */}
            <TouchableOpacity style={[styles.themeToggle, { backgroundColor: isDark ? '#444' : 'rgba(255, 255, 255, 0.8)' }]} onPress={toggleTheme}>
                <SunMoon size={32} color={isDark ? '#F1C40F' : '#1E234C'} />
            </TouchableOpacity>

            {/* Logo and Title Section */}
            <View style={styles.heroSection}>
                <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logo}
                resizeMode="contain"
                />
                <Text style={[styles.title, { color: isDark ? '#4FB3C3' : '#1E234C' }]}>SECURE LOCK</Text>
                <Text style={[styles.subtitle, { color: isDark ? '#BBB' : '#000' }]}>bloqueo total de dispositivos de forma remota</Text>
            </View>

            {/* Action Cards */}
            <View style={styles.actionContainer}>
                <ActionCard
                title="Dispositivo de Control"
                subtitle="Genera el codigo QR para vincular el dispositivo"
                icon={Shield}
                backgroundColor={COLORS.green}
                onPress={() => navigation.navigate('QRCode')}
                />
                <ActionCard
                title="Controlar Dispositivo"
                icon={Smartphone}
                backgroundColor={COLORS.red}
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
            <View style={[styles.menuContent, { backgroundColor: isDark ? '#2D2D2D' : '#FFF' }]}>
                <View style={styles.menuHeader}>
                    <Text style={[styles.menuTitle, { color: isDark ? '#FFF' : '#000' }]}>Menú</Text>
                    <TouchableOpacity onPress={() => setMenuVisible(false)}>
                        <X size={32} color={isDark ? '#FFF' : '#000'} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.menuItems}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); Alert.alert("Premium", "Redirigiendo..."); }}>
                        <CreditCard size={24} color="#6C5CE7" />
                        <Text style={[styles.menuItemText, { color: isDark ? '#FFF' : '#000' }]}>Adquirir Plan Premium</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); navigation.navigate('Account'); }}>
                        <User size={24} color="#6C5CE7" />
                        <Text style={[styles.menuItemText, { color: isDark ? '#FFF' : '#000' }]}>Cuenta del Usuario</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleLogout(); }}>
                        <LogOut size={24} color="#FF4757" />
                        <Text style={[styles.menuItemText, { color: isDark ? '#FFF' : '#000' }]}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#2D2D2D' : '#C5C5C5' }]}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={32} color={isDark ? '#4FB3C3' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#4FB3C3' : '#000' }]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Salas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Account')}>
          <User size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>Cuenta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8C3C0', // Header area color as in image
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#A8C3C0',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#1E234C', // Dark blue circular background
    padding: 6,
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
    fontSize: 36,
    fontWeight: '800',
    color: '#1E234C',
    letterSpacing: 2,
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
    height: 80,
    backgroundColor: '#C5C5C5', // Greyish bottom nav as in image
    borderTopWidth: 1,
    borderTopColor: '#AAA',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    fontWeight: '700',
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
    padding: 20,
    paddingTop: 50,
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
