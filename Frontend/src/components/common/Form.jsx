import React from 'react';
import { Input } from './Input';
import Button from './Button';
import { Alert } from './Alert';

export const Form = ({
  title,
  fields,
  onSubmit,
  submitText = 'Submit',
  error,
  loading = false,
  className = ''
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    fields.forEach(field => {
      data[field.name] = formData.get(field.name);
    });
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      )}

      {error && (
        <Alert type="error" onClose={() => {}}>
          {error}
        </Alert>
      )}

      <div className="space-y-4">
        {fields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type={field.type || 'text'}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            error={field.error}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : submitText}
        </Button>
      </div>
    </form>
  );
};

export const FormGroup = ({ label, children, error }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const TextArea = ({
  name,
  value,
  onChange,
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}; 