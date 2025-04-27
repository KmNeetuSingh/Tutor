import React from 'react';

export const Checkbox = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <input
          type="checkbox"
          className={`
            h-4 w-4 rounded border-gray-300 text-indigo-600
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
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 