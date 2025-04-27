import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode, theme } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative flex items-center justify-center w-12 h-6 rounded-full transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: theme.accent2,
        border: `1px solid ${theme.border}`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        className="absolute left-1 w-4 h-4 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: theme.primary,
          color: theme.text,
        }}
        animate={{
          x: darkMode ? 26 : 0,
          rotate: darkMode ? 360 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        {darkMode ? (
          <FaSun size={12} />
        ) : (
          <FaMoon size={12} />
        )}
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <FaSun size={12} style={{ color: theme.textSecondary }} />
        <FaMoon size={12} style={{ color: theme.textSecondary }} />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 