import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const { theme } = useTheme();

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.375rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    width: 'auto',
    ...(size === 'sm' && {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    }),
    ...(size === 'md' && {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
    }),
    ...(size === 'lg' && {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
    }),
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.primary,
      color: theme.text,
      '&:hover': {
        backgroundColor: theme.primaryDark,
      },
      '&:disabled': {
        backgroundColor: theme.primaryLight,
        cursor: 'not-allowed',
      },
    },
    secondary: {
      backgroundColor: theme.accent,
      color: theme.text,
      '&:hover': {
        backgroundColor: theme.accent2,
      },
      '&:disabled': {
        backgroundColor: theme.accent2,
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    danger: {
      backgroundColor: theme.error,
      color: theme.text,
      '&:hover': {
        backgroundColor: theme.errorDark,
      },
      '&:disabled': {
        backgroundColor: theme.error,
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
    outline: {
      backgroundColor: 'transparent',
      border: `1px solid ${theme.primary}`,
      color: theme.primary,
      '&:hover': {
        backgroundColor: theme.primary,
        color: theme.text,
      },
      '&:disabled': {
        borderColor: theme.primaryLight,
        color: theme.primaryLight,
        cursor: 'not-allowed',
      },
    },
  };

  const buttonStyles = {
    ...baseStyles,
    ...variantStyles[variant],
  };

  return (
    <button
      style={buttonStyles}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 