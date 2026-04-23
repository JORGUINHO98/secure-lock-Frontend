import React from 'react';
import { Platform, View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  ScrollView,
  Alert } from 'react-native';
import { User, LogOut, CreditCard, ChevronRight, Home, Users, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';

const AccountScreen = ({ navigation }) => {
  const { theme, user, logout } = useAppContext();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const handleLogout = () => {
    Alert.alert(
      t('common.logout'),
      t('rooms.delete_confirm'), // Reusing similar string or add new one
      [
        { text: t('common.cancel'), style: "cancel" },
        { text: t('common.logout'), style: "destructive", onPress: () => {
          logout();
          navigation.navigate('Auth');
        }}
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, showChevron = true }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]} 
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={[styles.menuItemText, { color: isDark ? '#FFF' : '#000' }]}>{title}</Text>
      </View>
      {showChevron && <ChevronRight size={24} color={isDark ? '#AAA' : '#666'} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#A8C3C0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#A8C3C0' }]}>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1E234C' }]}>{t('common.account')}</Text>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>

      <ScrollView style={styles.content}>
        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: isDark ? '#333' : '#F0F0F0' }]}>
          <View style={styles.avatar}>
            <User size={50} color="#FFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: isDark ? '#FFF' : '#000' }]}>{user?.name || t('common.user')}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <MenuItem 
            icon={<CreditCard size={24} color="#6C5CE7" />} 
            title={t('account.premium_plan') || "Plan Premium"} 
            onPress={() => navigation.navigate('Premium')}
          />
          <MenuItem 
            icon={<User size={24} color="#6C5CE7" />} 
            title={t('account.personal_data')} 
            onPress={() => navigation.navigate('AccountDetails')}
          />
          <MenuItem 
            icon={<Settings size={24} color="#6C5CE7" />} 
            title={t('common.settings')} 
            onPress={() => navigation.navigate('Settings')}
          />
          <MenuItem 
            icon={<LogOut size={24} color="#FF4757" />} 
            title={t('common.logout')} 
            onPress={handleLogout}
            showChevron={false}
          />
        </View>
      </ScrollView>
      </View>

      {/* Bottom Nav */}
      <View style={[styles.bottomNav, { backgroundColor: isDark ? '#2D2D2D' : '#B0B0B0' }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Home size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>{t('common.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Rooms')}>
          <Users size={32} color={isDark ? '#FFF' : '#000'} />
          <Text style={[styles.navText, { color: isDark ? '#FFF' : '#000' }]}>{t('common.rooms')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} activeOpacity={1}>
          <User size={32} color={isDark ? '#6C5CE7' : '#6C5CE7'} />
          <Text style={[styles.navText, { color: '#6C5CE7' }]}>{t('common.account')}</Text>
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
    paddingVertical: 20,
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
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  menuSection: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
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
    height: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default AccountScreen;
