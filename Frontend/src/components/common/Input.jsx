import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  
  const baseStyles = "w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const style = {
    backgroundColor: theme.inputBg,
    borderColor: error ? theme.error : theme.border,
    color: theme.text,
    '::placeholder': {
      color: theme.textSecondary
    },
    ':focus': {
      borderColor: theme.accent,
      ringColor: theme.accent
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
          {label}
        </label>
      )}
      <input
        className={baseStyles}
        style={style}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: theme.error }}>{error}</p>
      )}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
          {label}
        </label>
      )}
      <textarea
        className="w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: theme.inputBg,
          borderColor: error ? theme.error : theme.border,
          color: theme.text,
          minHeight: '100px',
          resize: 'vertical'
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: theme.error }}>{error}</p>
      )}
    </div>
  );
}; 