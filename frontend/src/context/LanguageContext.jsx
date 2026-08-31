import React, { createContext, useContext, useState } from 'react';
import { vi } from '../locales/vi';
import { en } from '../locales/en';

const translations = {
  vi,
  en,
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('app_language');
    if (saved && (saved === 'vi' || saved === 'en')) {
      return saved;
    }
    return 'vi'; // Default to Vietnamese
  });

  const setLanguage = (lang) => {
    if (lang === 'vi' || lang === 'en') {
      setLanguageState(lang);
      localStorage.setItem('app_language', lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
  };

  // Helper translation function supporting dot notation e.g. t('navbar.accommodations')
  const t = (path, params = {}) => {
    const currentDict = translations[language] || translations.vi;
    const keys = path.split('.');
    
    let result = currentDict;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        // Fallback to English dictionary if not found in current dictionary
        let fallbackResult = translations.en;
        for (const fbKey of keys) {
          if (fallbackResult && typeof fallbackResult === 'object' && fbKey in fallbackResult) {
            fallbackResult = fallbackResult[fbKey];
          } else {
            fallbackResult = null;
            break;
          }
        }
        result = fallbackResult || path;
        break;
      }
    }

    if (typeof result === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach((placeholder) => {
        result = result.replace(new RegExp(`{${placeholder}}`, 'g'), params[placeholder]);
      });
    }

    return typeof result === 'string' ? result : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
