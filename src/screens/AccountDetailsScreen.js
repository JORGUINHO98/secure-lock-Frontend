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
import { User, Mail, Phone, MapPin, Save, Camera } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import { COLORS, SPACING } from '../theme/colors';
import Header from '../components/Header';
import api from '../services/api';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const InputField = ({ icon: Icon, label, value, onChangeText, keyboardType = 'default', editable = true, isDark = false }) => {
  const themeColors = isDark ? COLORS.dark : COLORS.light;
  return (
  <View style={styles.inputContainer}>
    <Text style={[styles.label, { color: themeColors.textSecondary }]}>{label}</Text>
    <View style={[
      styles.inputWrapper, 
      { 
        backgroundColor: editable ? themeColors.surface : (isDark ? '#1E2338' : '#EAEEF3'),
        borderColor: themeColors.border,
      }
    ]}>
      <Icon size={20} color={editable ? COLORS.primary : COLORS.text.secondary} style={styles.inputIcon} />
      <TextInput
        style={[styles.input, { color: editable ? themeColors.text : themeColors.textSecondary }]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={themeColors.textSecondary}
        editable={editable}
      />
    </View>
  </View>
  );
};

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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Re-fetch del perfil para obtener la URL REAL del servidor
      // (la URI local del dispositivo se invalida entre sesiones)
      try {
        const profileResponse = await api.get('/users/me/');
        const data = profileResponse.data;
        const serverAvatarUrl =
          data.avatar || data.profile_image || data.photo || data.image || uri;
        setUser(prev => ({ ...prev, avatar: serverAvatarUrl }));
        console.log('[FOTO] Avatar guardado con URL del servidor:', serverAvatarUrl);
      } catch {
        // Si el re-fetch falla, usamos la URI local como fallback temporal
        setUser(prev => ({ ...prev, avatar: uri }));
        console.log('[FOTO] Re-fetch falló, usando URI local temporalmente.');
      }
    } catch (error) {
      console.log('[FOTO] Error subiendo foto al backend:', error.message);
      Alert.alert('Advertencia', 'No se pudo subir la foto al servidor. Se mostrará localmente hasta reiniciar.');
      // Guardar URI local como fallback
      setUser(prev => ({ ...prev, avatar: uri }));
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
      // Guardar en el backend
      await api.patch('/users/me/', {
        full_name: formData.name,
        phone: formData.phone,
        location: formData.location,
      });
      console.log('[PERFIL] Datos actualizados en el backend.');

      // Re-fetch para confirmar lo que guardó el servidor
      const profileResponse = await api.get('/users/me/');
      const data = profileResponse.data;
      const serverAvatar = data.avatar || data.profile_image || data.photo || data.image || user?.avatar || null;

      setUser(prev => ({
        ...prev,
        ...data,
        name: data.full_name || data.name || formData.name,
        full_name: data.full_name || formData.name,
        avatar: serverAvatar,
        phone: data.phone || formData.phone,
        location: data.location || formData.location,
      }));

      Alert.alert(t('common.success'), t('account.update_success'));
      navigation.goBack();
    } catch (error) {
      console.log('[PERFIL] Error actualizando:', error.response?.status, JSON.stringify(error.response?.data));

      // Aunque falle el backend, actualizamos el estado local para que se vea el cambio
      // pero avisamos al usuario
      setUser(prev => ({
        ...prev,
        name: formData.name,
        full_name: formData.name,
        phone: formData.phone,
        location: formData.location,
        // preservamos el avatar actual sin sobreescribirlo
        avatar: prev?.avatar,
      }));

      const errMsg = error.response?.data?.detail || error.response?.data?.error || 'Sin conexión con el servidor.';
      Alert.alert(
        'Guardado parcialmente',
        `Los cambios se guardaron en tu dispositivo, pero no en el servidor: ${errMsg}`
      );
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1120' : COLORS.secondary }]}>
      <StatusBar barStyle="light-content" />

      <Header 
        title={t('account.personal_data')}
        showBack
        onBack={() => navigation.goBack()}
        isDark={true}
      />

      <View style={[styles.contentWrapper, { backgroundColor: isDark ? '#1A1A2E' : COLORS.background.surface }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.7}>
                <View style={[styles.avatar, { backgroundColor: COLORS.primary }]}>
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
    color: COLORS.primary,
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
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountDetailsScreen;
