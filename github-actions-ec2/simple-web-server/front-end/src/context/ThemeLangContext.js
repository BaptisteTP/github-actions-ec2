'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeLangContext = createContext();

export function ThemeLangProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('fr');

  const themeClasses = {
  light: "bg-white text-black",
  dark: "bg-black text-white",
  "dark-orange": "bg-[#121212] text-[#f97316]",
  "dark-blue": "bg-[#121212] text-[#2563eb]",
  "light-orange": "bg-white text-[#f97316]",
};

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const storedLang = localStorage.getItem('language');
    if (storedTheme) setTheme(storedTheme);
    if (storedLang) setLanguage(storedLang);
  }, []);

  useEffect(() => {
  localStorage.setItem('theme', theme);
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}, [theme]);


  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <ThemeLangContext.Provider value={{ theme, setTheme, language, setLanguage }}>
      {children}
    </ThemeLangContext.Provider>
  );
}

export function useThemeLang() {
  const context = useContext(ThemeLangContext);
  if (context === undefined) {
    throw new Error('useThemeLang must be used within a ThemeLangProvider');
  }
  return context;
}
