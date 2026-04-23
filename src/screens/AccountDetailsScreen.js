import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { ChevronLeft, User, Mail, Phone, MapPin, Save } from 'lucide-react-native';
import { useAppContext } from '../context/AppContext';

const AccountDetailsScreen = ({ navigation }) => {
  const { theme, user } = useAppContext();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: user?.name || 'Usuario',
    email: user?.email || 'usuario@ejemplo.com',
    phone: user?.phone || '+1 234 567 890',
    location: user?.location || 'Ciudad, País',
  });

  const handleSave = () => {
    Alert.alert("Éxito", "Tus datos han sido actualizados correctamente.");
    navigation.goBack();
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, keyboardType = 'default' }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#333' : '#F5F5F5' }]}>
        <Icon size={20} color={isDark ? '#FFF' : '#333'} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: isDark ? '#FFF' : '#000' }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={isDark ? '#666' : '#999'}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#000' }]}>Datos Personales</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: '#6C5CE7' }]}>
              <User size={60} color="#FFF" />
            </View>
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Text style={styles.changeAvatarText}>Cambiar Foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <InputField 
              icon={User} 
              label="Nombre Completo" 
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
            <InputField 
              icon={Mail} 
              label="Correo Electrónico" 
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
            />
            <InputField 
              icon={Phone} 
              label="Teléfono" 
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
            />
            <InputField 
              icon={MapPin} 
              label="Ubicación" 
              value={formData.location}
              onChangeText={(text) => setFormData({...formData, location: text})}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={20} color="#FFF" style={{ marginRight: 10 }} />
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  changeAvatarButton: {
    marginTop: 15,
  },
  changeAvatarText: {
    color: '#6C5CE7',
    fontWeight: '600',
    fontSize: 16,
  },
  form: {
    paddingHorizontal: 25,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#6C5CE7',
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountDetailsScreen;
