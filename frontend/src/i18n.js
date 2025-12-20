import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importaremos os arquivos de tradução aqui
import translationPT from './locales/pt.json';
import translationEN from './locales/en.json';
import translationES from './locales/es.json';

const resources = {
  pt: {
    translation: translationPT
  },
  en: {
    translation: translationEN
  },
  es: {
    translation: translationES
  }
};

i18n
  .use(LanguageDetector) // Detecta o idioma do navegador
  .use(initReactI18next) // Passa a instância para o React
  .init({
    resources,
    fallbackLng: 'pt', // Se não detectar, usa PT
    interpolation: {
      escapeValue: false // React já protege contra XSS
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;