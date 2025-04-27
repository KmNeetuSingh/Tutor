import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Badge = ({ children, variant = 'default' }) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          color: theme.text,
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          color: theme.text,
        };
      case 'success':
        return {
          backgroundColor: theme.success,
          color: theme.text,
        };
      case 'danger':
        return {
          backgroundColor: theme.danger,
          color: theme.text,
        };
      case 'warning':
        return {
          backgroundColor: theme.warning,
          color: theme.text,
        };
      case 'info':
        return {
          backgroundColor: theme.info,
          color: theme.text,
        };
      default:
        return {
          backgroundColor: theme.accent,
          color: theme.text,
        };
    }
  };

  return (
    <span
      className="px-2 py-1 text-xs font-medium rounded-full"
      style={getVariantStyles()}
    >
      {children}
    </span>
  );
};

export default Badge; 