import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const ThemeContext = createContext();

// 2. Create the Provider
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : true; // Default to dark mode
  });

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    if (darkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [darkMode]);

  const theme = {
    dark: {
      primary: '#123458',
      primaryDark: '#030303',
      secondary: '#D4C9BE',
      accent: '#D4C9BE',
      accent2: '#F1EFEC',
      text: '#F1EFEC',
      textSecondary: '#D4C9BE',
      background: '#030303',
      cardBg: '#123458',
      border: '#123458',
      error: '#ef4444',
      errorDark: '#dc2626',
      success: '#10B981',
      successDark: '#059669',
      warning: '#F59E0B',
      warningDark: '#D97706',
      inputBg: '#123458',
      primaryLight: '#D4C9BE'
    },
    light: {
      primary: '#123458',
      primaryDark: '#030303',
      secondary: '#D4C9BE',
      accent: '#123458',
      accent2: '#030303',
      text: '#030303',
      textSecondary: '#D4C9BE',
      background: '#F1EFEC',
      cardBg: '#D4C9BE',
      border: '#D4C9BE',
      error: '#ef4444',
      errorDark: '#dc2626',
      success: '#10B981',
      successDark: '#059669',
      warning: '#F59E0B',
      warningDark: '#D97706',
      inputBg: '#fff',
      primaryLight: '#D4C9BE'
    }
  };

  const currentTheme = darkMode ? theme.dark : theme.light;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme: currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create the custom hook (export after the Provider)
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
