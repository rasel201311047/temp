import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Translation resources
const resources = {
  en: {
    translation: {
      settings: 'Settings',
      font: 'Font',
      fontSize: 'Font Size',
      welcome: 'Welcome',
      home: 'Home',
      profile: 'Profile',
      // Add more translations as needed
    }
  },
  es: {
    translation: {
      settings: 'Configuración',
      font: 'Fuente',
      fontSize: 'Tamaño de Fuente',
      welcome: 'Bienvenido',
      home: 'Inicio',
      profile: 'Perfil',
    }
  },
  fr: {
    translation: {
      settings: 'Paramètres',
      font: 'Police',
      fontSize: 'Taille de Police',
      welcome: 'Bienvenue',
      home: 'Accueil',
      profile: 'Profil',
    }
  },
  de: {
    translation: {
      settings: 'Einstellungen',
      font: 'Schriftart',
      fontSize: 'Schriftgröße',
      welcome: 'Willkommen',
      home: 'Startseite',
      profile: 'Profil',
    }
  },
  // Add more languages as needed
};

// Language detection plugin
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // First try to get saved language from AsyncStorage
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        return callback(savedLanguage);
      }
      
      // If no saved language, use device language
      const locales = RNLocalize.getLocales();
      if (locales && locales.length > 0) {
        return callback(locales[0].languageCode);
      }
      
      // Fallback to English
      return callback('en');
    } catch (error) {
      console.error('Error detecting language:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }
};

// Initialize i18n
i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false, // Set to true for development
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;