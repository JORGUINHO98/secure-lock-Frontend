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
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import { Undo2, Moon, Bell, Globe, Shield, HelpCircle, Info, Check, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const SettingsScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useAppContext();
  const { t, i18n } = useTranslation();
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const changeLanguage = async (lang) => {
    console.log('Solicitando cambio a:', lang);
    
    try {
      if (i18n && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(lang);
        console.log('Idioma cambiado exitosamente en i18next');
      } else {
        console.error('i18n.changeLanguage no es una función. i18n es:', typeof i18n);
        // Fallback: intentar usar el i18n global si el del hook falla
        const globalI18n = require('../i18n').default;
        if (globalI18n && typeof globalI18n.changeLanguage === 'function') {
          await globalI18n.changeLanguage(lang);
          console.log('Idioma cambiado usando instancia global');
        } else {
          throw new Error('No se pudo encontrar la función changeLanguage');
        }
      }

      try {
        await SecureStore.setItemAsync('user-language', lang);
        console.log('Idioma persistido en SecureStore');
      } catch (storageErr) {
        console.log('Error persistiendo idioma en SecureStore (continuando anyway):', storageErr.message);
      }
      
      setLangModalVisible(false);
    } catch (err) {
      console.error('Error en el flujo de cambio de idioma:', err);
      setLangModalVisible(false);
    }
  };

  const getLanguageName = (lang) => {
    switch (lang) {
      case 'es': return 'Español';
      case 'en': return 'English';
      case 'pt': return 'Português';
      default: return 'Español';
    }
  };

  const SettingItem = ({ icon: Icon, title, description, value, onValueChange, type = 'switch', onPress }) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.offWhite }]}
      onPress={onPress}
      disabled={type === 'switch'}
    >
      <View style={styles.settingIconContainer}>
        <Icon size={22} color={COLORS.primary} />
      </View>
      <View style={styles.settingTextContainer}>
        <Text style={[styles.settingTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>{title}</Text>
        {description && <Text style={[styles.settingDescription, { color: COLORS.text.secondary }]}>{description}</Text>}
      </View>
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: COLORS.primary }}
          thumbColor={Platform.OS === 'ios' ? '#FFF' : value ? '#FFF' : '#f4f3f4'}
        />
      ) : (
        <View style={styles.valueContainer}>
          <Text style={styles.settingValue}>{value}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Undo2 size={32} color={COLORS.text.white} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text.white }]}>{t('common.settings')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Preferencia de Visualización</Text>
          <SettingItem
            icon={Moon}
            title="Modo Oscuro"
            description="Ajusta la apariencia de la aplicación"
            value={isDark}
            onValueChange={toggleTheme}
          />

          <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Notificaciones</Text>
          <SettingItem
            icon={Bell}
            title="Notificaciones Push"
            description="Recibe alertas de seguridad y estado"
            value={notifications}
            onValueChange={setNotifications}
          />

          <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Seguridad</Text>
          <SettingItem
            icon={Shield}
            title="Autenticación Biométrica"
            description="Huella dactilar o FaceID"
            value={biometrics}
            onValueChange={setBiometrics}
          />

          <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>Aplicación</Text>
          <SettingItem
            icon={Globe}
            title={t('common.language') || "Idioma"}
            value={getLanguageName(i18n.language)}
            type="text"
            onPress={() => setLangModalVisible(true)}
          />
          <SettingItem
            icon={HelpCircle}
            title="Centro de Ayuda"
            type="text"
            onPress={() => { }}
          />
          <SettingItem
            icon={Info}
            title="Versión de la App"
            value="1.0.4 (2026)"
            type="text"
            onPress={() => { }}
          />
        </ScrollView>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={langModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLangModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setLangModalVisible(false)}
        >
          <View 
            style={[styles.modalContent, { backgroundColor: isDark ? '#2A2F45' : COLORS.background.surface }]}
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>Seleccionar Idioma</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <X size={24} color={isDark ? COLORS.text.white : COLORS.text.main} />
              </TouchableOpacity>
            </View>
            
            {['es', 'en', 'pt'].map((lang) => (
              <TouchableOpacity 
                key={lang} 
                style={styles.langOption} 
                onPress={() => changeLanguage(lang)}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 50, right: 50 }}
              >
                <Text style={[styles.langText, { color: isDark ? COLORS.text.white : COLORS.text.main }]}>{getLanguageName(lang)}</Text>
                {i18n.language && i18n.language.startsWith(lang) && <Check size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

// Screen components

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  contentWrapper: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 25,
    marginBottom: 12,
    marginLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 13,
    color: '#888',
    marginTop: 3,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  langText: {
    fontSize: 18,
    fontWeight: '500',
  }
});

export default SettingsScreen;
