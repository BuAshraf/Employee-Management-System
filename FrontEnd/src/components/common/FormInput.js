import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced input component with no interruption handling
 * Works seamlessly with useFormInput hook
 */
const FormInput = forwardRef(({
  label,
  error,
  touched,
  required = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  type = 'text',
  placeholder,
  helpText,
  leftIcon,
  rightIcon,
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  const baseInputClasses = `
    w-full p-3 border rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error && touched ? 'border-red-500 bg-red-50' : 'border-slate-200'}
    ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
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

  const helpTextClasses = `
    text-sm text-slate-500 mt-1
  `;

  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={baseInputClasses}
          placeholder={placeholder}
          disabled={disabled || loading}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
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
      
      {helpText && !error && (
        <div className={helpTextClasses}>
          {helpText}
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
