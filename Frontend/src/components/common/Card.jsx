import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Card = ({
  children,
  className = '',
  title,
  headerAction,
  ...props
}) => {
  const { theme } = useTheme();
  
  const style = {
    backgroundColor: theme.cardBg,
    borderColor: theme.border,
    color: theme.text
  };

  return (
    <div
      className={`
        rounded-lg border shadow-sm
        ${className}
      `}
      style={style}
      {...props}
    >
      {(title || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        px-6 py-4 border-b border-gray-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        px-6 py-4
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        px-6 py-4 border-t border-gray-200
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}; 