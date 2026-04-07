import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from './translations';

/* eslint-disable react-refresh/only-export-components */

const PreferencesContext = createContext();

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  return stored || 'light';
};

const getInitialLanguage = () => {
  const stored = localStorage.getItem('language');
  return stored || 'fr';
};

export const PreferencesProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Handle RTL for Arabic
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = useMemo(() => {
    const dict = translations[language] || translations.fr;
    return (key) => dict[key] || key;
  }, [language]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    language,
    setLanguage,
    t,
  }), [theme, language, t]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);
