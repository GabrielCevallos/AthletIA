import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export const LANGUAGES = {
  es: { label: 'Español', apiValue: 'spanish' },
  en: { label: 'English', apiValue: 'english' }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    detection: {
      // Orden de prioridad: localStorage > navegador
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'], // Guardar en localStorage para visitas futuras
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    debug: false,
    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    },
  });

export default i18n;
