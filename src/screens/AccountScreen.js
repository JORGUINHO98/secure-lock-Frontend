import React from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Alert,
  Image } from 'react-native';
import { User, LogOut, CreditCard, ChevronRight, Home, Users, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../theme/colors';

const AccountScreen = ({ navigation }) => {
  const { theme, user, logout } = useAppContext();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      t('common.logout'),
      t('rooms.delete_confirm'),
      [
        { text: t('common.cancel'), style: "cancel" },
        { text: t('common.logout'), style: "destructive", onPress: () => {
          logout();
          navigation.navigate('Auth');
        }}
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, showChevron = true, isDestructive = false }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]} 
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[
          styles.menuItemText, 
          { color: isDestructive ? COLORS.status.locked : (isDark ? COLORS.text.white : COLORS.text.main) }
        ]}>{title}</Text>
      </View>
      {showChevron && <ChevronRight size={24} color={isDark ? COLORS.text.secondary : COLORS.text.secondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>{t('common.account')}</Text>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.main }]}>

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}>
          <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
            {(user?.avatar || user?.profile_image || user?.photo) ? (
              <Image
                source={{ uri: user.avatar || user.profile_image || user.photo }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
            ) : (
              <User size={50} color={COLORS.text.white} />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>{user?.name || user?.full_name || user?.username || t('common.user')}</Text>
            <Text style={[styles.userEmail, { color: COLORS.text.secondary }]}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuItem 
            icon={<CreditCard size={24} color={COLORS.primary} />} 
            title={t('account.premium_plan') || "Plan Premium"} 
            onPress={() => navigation.navigate('Premium')}
          />
          <MenuItem 
            icon={<User size={24} color={COLORS.primary} />} 
            title={t('account.personal_data')} 
            onPress={() => navigation.navigate('AccountDetails')}
          />
          <MenuItem 
            icon={<Settings size={24} color={COLORS.primary} />} 
            title={t('common.settings')} 
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuItem 
            icon={<LogOut size={24} color={COLORS.status.locked} />} 
            title={t('common.logout')} 
            onPress={handleLogout}
            showChevron={false}
            isDestructive
          />
        </View>
      </ScrollView>
      </View>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={28} color={isDark ? COLORS.text.secondary : COLORS.secondary} />
          <Text style={[styles.navText, { color: isDark ? COLORS.text.secondary : COLORS.secondary }]}>{t('common.rooms')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={1}>
          <User size={28} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary }]}>{t('common.account')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  header: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    paddingTop: 55,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  contentWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 5,
  },
  menuSection: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.sm + 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
  bottomNav: {
    flexDirection: 'row',
    height: 90,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
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
});

export default AccountScreen;
