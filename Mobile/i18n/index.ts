import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enUS from './locales/en-US.json';
import es419 from './locales/es-419.json';

const resources = {
  'en-US': { translation: enUS },
  'es-419': { translation: es419 },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    const deviceLanguage = Localization.getLocales()[0].languageTag;
    savedLanguage = deviceLanguage.startsWith('es') ? 'es-419' : 'en-US';
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    resources,
    lng: savedLanguage,
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
