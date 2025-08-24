import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced select component with no interruption handling
 */
const FormSelect = forwardRef(({
  label,
  options = [],
  error,
  touched,
  required = false,
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  const baseSelectClasses = `
    w-full p-3 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error && touched ? 'border-red-500 bg-red-50' : 'border-slate-200'}
    ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
    ${className}
  `;

  const labelClasses = `
    block text-sm font-medium mb-2 transition-colors duration-200
    ${error && touched ? 'text-red-700' : 'text-slate-700'}
    ${labelClassName}
  `;

  const errorClasses = `
    text-sm text-red-600 mt-1 transition-all duration-200
    ${errorClassName}
  `;

  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={baseSelectClasses}
          disabled={disabled || loading}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option 
              key={option.value || index} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {loading && (
          <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>
      
      {error && touched && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={errorClasses}
          role="alert"
          id={`${props.name}-error`}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

export default FormSelect;
