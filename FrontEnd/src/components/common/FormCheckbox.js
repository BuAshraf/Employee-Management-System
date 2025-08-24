import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced checkbox/toggle component with no interruption handling
 */
const FormCheckbox = forwardRef(({
  label,
  description,
  error,
  touched,
  required = false,
  type = 'checkbox', // 'checkbox' or 'toggle'
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  disabled = false,
  loading = false,
  size = 'md', // 'sm', 'md', 'lg'
  ...props
}, ref) => {
  const sizeClasses = {
    sm: type === 'toggle' ? 'w-8 h-4' : 'w-4 h-4',
    md: type === 'toggle' ? 'w-11 h-6' : 'w-5 h-5',
    lg: type === 'toggle' ? 'w-14 h-8' : 'w-6 h-6',
  };

  const checkboxClasses = `
    ${sizeClasses[size]} border rounded transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    ${error && touched ? 'border-red-500' : 'border-slate-300'}
    ${props.checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white'}
    ${className}
  `;

  const toggleClasses = `
    ${sizeClasses[size]} bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 
    rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
    after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
    after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
    peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
    ${error && touched ? 'peer-checked:bg-red-500' : ''}
    ${className}
  `;

  const labelClasses = `
    ${type === 'toggle' ? 'cursor-pointer' : 'cursor-pointer flex items-center'}
    ${disabled ? 'cursor-not-allowed opacity-50' : ''}
    ${labelClassName}
  `;

  const errorClasses = `
    text-sm text-red-600 mt-1 transition-all duration-200
    ${errorClassName}
  `;

  if (type === 'toggle') {
    return (
      <div className={containerClassName}>
        <div className="flex items-center justify-between">
          <div>
            {label && (
              <h4 className={`font-medium text-slate-800 ${labelClasses}`}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </h4>
            )}
            {description && (
              <p className="text-sm text-slate-600">{description}</p>
            )}
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              disabled={disabled || loading}
              {...props}
            />
            <div className={toggleClasses}></div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
                />
              </div>
            )}
          </label>
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
  }

  return (
    <div className={containerClassName}>
      <label className={labelClasses}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className={checkboxClasses}
            disabled={disabled || loading}
            {...props}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          )}
        </div>
        {label && (
          <span className="ml-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        )}
      </label>
      
      {description && (
        <p className="text-sm text-slate-600 ml-7 mt-1">{description}</p>
      )}
      
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

FormCheckbox.displayName = 'FormCheckbox';

export default FormCheckbox;
