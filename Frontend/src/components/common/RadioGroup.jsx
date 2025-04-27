import React from 'react';

export const RadioGroup = ({
  label,
  error,
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="space-y-2" {...props}>
        {children}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export const RadioOption = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <input
          type="radio"
          className={`
            h-4 w-4 border-gray-300 text-indigo-600
            focus:ring-indigo-500
            ${error ? 'border-red-300' : ''}
          `}
          {...props}
        />
        {label && (
          <label className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        )}
      </div>
    </div>
  );
}; 