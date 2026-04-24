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
  Alert,
  Dimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import { ChevronLeft, User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

// InputField definido FUERA del componente para evitar que el teclado se cierre al escribir
const InputField = ({ icon: Icon, label, value, onChangeText, keyboardType = 'default', editable = true, isDark = false }) => (
  <View style={styles.inputContainer}>
    <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{label}</Text>
    <View style={[styles.inputWrapper, { backgroundColor: isDark ? (editable ? '#333' : '#2A2A2A') : (editable ? '#F5F5F5' : '#E8E8E8') }]}>
      <Icon size={20} color={editable ? (isDark ? '#FFF' : '#333') : (isDark ? '#666' : '#999')} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: isDark ? (editable ? '#FFF' : '#888') : (editable ? '#000' : '#888') }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={isDark ? '#666' : '#999'}
        editable={editable}
      />
    </View>
  </View>
);

const AccountDetailsScreen = ({ navigation }) => {
  const { theme, user, setUser } = useAppContext();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  // URI local de la imagen seleccionada (para preview inmediato)
  const [selectedImageUri, setSelectedImageUri] = useState(null);

  // La URI de la foto puede venir del estado local o del usuario guardado
  const avatarUri = selectedImageUri || user?.avatar || user?.profile_image || user?.photo || null;

  // Actualizar el formulario cuando los datos del usuario estén disponibles
  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
      });
    }
  }, [user]);

  // Solicitar permisos y abrir selector de imagen
  const pickImage = async (useCamera = false) => {
    try {
      // Solicitar permiso
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            t('common.error'),
            t('account.camera')
          );
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            t('common.error'),
            t('account.gallery')
          );
          return;
        }
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
        : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImageUri(imageUri);

        // Subir la imagen al backend
        await uploadPhoto(imageUri);
      }
    } catch (error) {
      console.log('Error seleccionando imagen:', error.message);
      Alert.alert(t('common.error'), t('account.photo_error'));
    }
  };

  // Subir foto al backend
  const uploadPhoto = async (uri) => {
    setIsUploadingPhoto(true);
    try {
      const formDataUpload = new FormData();

      // Obtener el nombre y tipo del archivo
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formDataUpload.append('avatar', {
        uri,
        name: filename,
        type,
      });

      await api.patch('/users/me/', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar el estado global del usuario con la nueva foto
      setUser({
        ...user,
        avatar: uri,
      });
    } catch (error) {
      console.log('Error subiendo foto:', error.message);
      // Aunque falle el upload al backend, mantenemos la imagen localmente
      setUser({
        ...user,
        avatar: uri,
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Mostrar opciones de selección de imagen
  const handleChangePhoto = () => {
    Alert.alert(
      t('account.change_photo'),
      t('account.photo_source'),
      [
        {
          text: t('account.take_photo'),
          onPress: () => pickImage(true),
        },
        {
          text: t('account.from_gallery'),
          onPress: () => pickImage(false),
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      // Intentar actualizar en el backend
      await api.patch('/users/me/', {
        full_name: formData.name,
        phone: formData.phone,
        location: formData.location,
      });
    } catch (error) {
      console.log('Error actualizando perfil en el backend:', error.message);
    }

    setUser({
      ...user,
      name: formData.name,
      full_name: formData.name,
      phone: formData.phone,
      location: formData.location,
      // email no se modifica, se mantiene el original
    });
    Alert.alert(t('common.success'), t('account.update_success'));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1A1A1A' : '#A8C3C0' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { backgroundColor: isDark ? '#2D2D2D' : '#A8C3C0' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={32} color={isDark ? '#FFF' : '#1E234C'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#1E234C' }]}>{t('account.personal_data')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A1A' : '#FFF' }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
                <View style={[styles.avatar, { backgroundColor: '#6C5CE7' }]}>
                  {avatarUri ? (
                    <Image
                      source={{ uri: avatarUri }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <User size={60} color="#FFF" />
                  )}
                  {/* Overlay del ícono de cámara */}
                  <View style={styles.cameraOverlay}>
                    {isUploadingPhoto ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Camera size={18} color="#FFF" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.changeAvatarButton} onPress={handleChangePhoto}>
                <Text style={styles.changeAvatarText}>{t('account.change_photo')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <InputField
                icon={User}
                label={t('auth.fullName')}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                isDark={isDark}
              />
              <InputField
                icon={Mail}
                label={t('auth.email')}
                value={formData.email}
                onChangeText={() => { }}
                keyboardType="email-address"
                editable={false}
                isDark={isDark}
              />
              <InputField
                icon={Phone}
                label={t('account.phone')}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                isDark={isDark}
              />
              <InputField
                icon={MapPin}
                label={t('account.location')}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                isDark={isDark}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Save size={20} color="#FFF" style={{ marginRight: 10 }} />
                <Text style={styles.saveButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

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
    paddingBottom: 40,
    paddingHorizontal: 10,
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 20,
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
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
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
    height: 60,
    borderRadius: 15,
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
