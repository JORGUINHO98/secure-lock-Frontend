import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  Platform
} from 'react-native';
import { ChevronLeft, Moon, Bell, Globe, Shield, HelpCircle, Info } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useAppContext();
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const SettingItem = ({ icon: Icon, title, description, value, onValueChange, type = 'switch', onPress }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { backgroundColor: isDark ? '#333' : '#F9F9F9' }]}
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View style={styles.settingIconContainer}>
        <Icon size={22} color={isDark ? '#FFF' : '#333'} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: isDark ? '#FFF' : '#000' }]}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#6C5CE7' }}
          thumbColor={Platform.OS === 'ios' ? '#FFF' : value ? '#FFF' : '#f4f3f4'}
        />
      ) : (
        <Text style={styles.settingValue}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>Configuración</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#6C5CE7' : '#6C5CE7' }]}>Preferencia de Visualización</Text>
        <SettingItem 
          icon={Moon} 
          title="Modo Oscuro" 
          description="Ajusta la apariencia de la aplicación"
          value={isDark}
          onValueChange={toggleTheme}
        />

        <Text style={[styles.sectionTitle, { color: isDark ? '#6C5CE7' : '#6C5CE7' }]}>Notificaciones</Text>
        <SettingItem 
          icon={Bell} 
          title="Notificaciones Push" 
          description="Recibe alertas de seguridad y estado"
          value={notifications}
          onValueChange={setNotifications}
        />

        <Text style={[styles.sectionTitle, { color: isDark ? '#6C5CE7' : '#6C5CE7' }]}>Seguridad</Text>
        <SettingItem 
          icon={Shield} 
          title="Autenticación Biométrica" 
          description="Huella dactilar o FaceID"
          value={biometrics}
          onValueChange={setBiometrics}
        />

        <Text style={[styles.sectionTitle, { color: isDark ? '#6C5CE7' : '#6C5CE7' }]}>Aplicación</Text>
        <SettingItem 
          icon={Globe} 
          title="Idioma" 
          value="Español"
          type="text"
          onPress={() => {}}
        />
        <SettingItem 
          icon={HelpCircle} 
          title="Centro de Ayuda" 
          type="text"
          onPress={() => {}}
        />
        <SettingItem 
          icon={Info} 
          title="Versión de la App" 
          value="1.0.4 (2024)"
          type="text"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
});

export default SettingsScreen;
