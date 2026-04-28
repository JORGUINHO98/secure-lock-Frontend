import React from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Alert,
  Image,
  Dimensions } from 'react-native';
import { User, LogOut, CreditCard, ChevronRight, Home, Users, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme/colors';
import Header from '../components/Header';

const { width } = Dimensions.get('window');

const AccountScreen = ({ navigation }) => {
  const { theme, user, logout } = useAppContext();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const themeColors = isDark ? COLORS.dark : COLORS.light;

  const handleLogout = () => {
    Alert.alert(
      t('home.logout_title') || "Cerrar Sesión",
      t('home.logout_confirm') || "¿Estás seguro que quieres salir?",
      [
        { text: t('common.cancel') || "Cancelar", style: "cancel" },
        { text: t('common.logout') || "Cerrar Sesión", style: "destructive", onPress: () => {
          logout();
          navigation.navigate('Auth');
        }}
      ]
    );
  };

  const MenuItem = ({ icon: Icon, title, onPress, showChevron = true, isDestructive = false }) => (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        { 
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
        SHADOWS.small
      ]} 
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={[
          styles.menuIconCircle, 
          { backgroundColor: isDestructive ? 'rgba(255, 59, 48, 0.1)' : COLORS.primaryLight }
        ]}>
          <Icon size={20} color={isDestructive ? COLORS.status.locked : COLORS.primary} />
        </View>
        <Text style={[
          styles.menuItemText, 
          { color: isDestructive ? COLORS.status.locked : themeColors.text }
        ]}>{title}</Text>
      </View>
      {showChevron && <ChevronRight size={20} color={themeColors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />
      
      <Header 
        title={t('common.account') || "Mi Cuenta"}
        isDark={true}
      />
      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* User Info Card */}
        <View style={[
          styles.userCard, 
          { backgroundColor: themeColors.surface, borderColor: themeColors.border },
          SHADOWS.medium
        ]}>
          <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
            {(user?.avatar || user?.profile_image || user?.photo) ? (
              <Image
                source={{ uri: user.avatar || user.profile_image || user.photo }}
                style={styles.avatarImage}
              />
            ) : (
              <User size={40} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: themeColors.text }]}>
              {user?.name || user?.full_name || user?.username || t('common.user') || "Usuario"}
            </Text>
            <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>
              {user?.email || 'email@example.com'}
            </Text>
            <View style={[styles.planBadge, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={styles.planBadgeText}>PLAN PREMIUM</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuItem 
            icon={CreditCard} 
            title={t('account.premium_plan') || "Plan Premium"} 
            onPress={() => navigation.navigate('Premium')}
          />
          <MenuItem 
            icon={User} 
            title={t('account.personal_data') || "Datos Personales"} 
            onPress={() => navigation.navigate('AccountDetails')}
          />
          <MenuItem 
            icon={Settings} 
            title={t('common.settings') || "Configuración"} 
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuItem 
            icon={LogOut} 
            title={t('common.logout') || "Cerrar Sesión"} 
            onPress={handleLogout}
            showChevron={false}
            isDestructive
          />
        </View>
      </ScrollView>
      </View>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
        <NavButton icon={Home} label={t('common.home') || "Inicio"} onPress={() => navigation.navigate('Home')} isDark={isDark} />
        <NavButton icon={Users} label={t('common.rooms') || "Salas"} onPress={() => navigation.navigate('Rooms')} isDark={isDark} />
        <NavButton icon={User} label={t('common.account') || "Cuenta"} active isDark={isDark} />
      </View>
    </SafeAreaView>
  );
};

const NavButton = ({ icon: Icon, label, active, onPress, isDark }) => {
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  const color = active ? COLORS.primary : themeColors.textSecondary;
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Icon size={24} color={color} strokeWidth={active ? 2.5 : 2} />
      <Text style={[styles.navText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    padding: SPACING.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 24,
    marginBottom: SPACING.xl,
    borderWidth: 1,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarImage: {
    width: 90, 
    height: 90, 
  },
  userInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  userName: {
    ...TYPOGRAPHY.h2,
    fontSize: 20,
  },
  userEmail: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  planBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  menuSection: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 20,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
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
});

export default AccountScreen;
