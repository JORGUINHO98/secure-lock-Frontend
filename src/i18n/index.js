import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import * as SecureStore from 'expo-secure-store';
import es from './es.json';
import en from './en.json';
import pt from './pt.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
  pt: { translation: pt },
};

// Obtener el código de idioma inicial de forma síncrona
const getDeviceLanguage = () => {
  const locales = Localization.getLocales();
  if (locales && locales.length > 0) {
    return locales[0].languageCode;
  }
  return 'es';
};

// Inicializar i18n de forma síncrona con el idioma del dispositivo o fallback
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getDeviceLanguage(),
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

// Cargar el idioma guardado de forma asíncrona después de la inicialización
const loadSavedLanguage = async () => {
  try {
    const savedLanguage = await SecureStore.getItemAsync('user-language');
    if (savedLanguage && i18n.changeLanguage) {
      await i18n.changeLanguage(savedLanguage);
      console.log('Idioma cargado de SecureStore:', savedLanguage);
    }
  } catch (error) {
    console.log('Error cargando idioma de SecureStore (usando default):', error.message);
  }
};

loadSavedLanguage();

export default i18n;
