import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook for handling form inputs without interruption
 * Provides smooth navigation between fields and prevents focus loss
 */
const useFormInput = (initialState = {}, options = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const inputRefs = useRef({});

  const {
    validateOnChange = false,
    validateOnBlur = true,
    validators = {}
  } = options;

  // Stable input change handler that prevents re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle different input types without interruption
    let processedValue;
    switch (type) {
      case 'checkbox':
        processedValue = checked;
        break;
      case 'radio':
        processedValue = value;
        break;
      case 'number':
        // Keep raw value during typing to prevent interruption
        processedValue = value;
        break;
      case 'file':
        processedValue = files;
        break;
      default:
        processedValue = value;
    }

    // Update values using functional update to prevent race conditions
    setValues(prev => {
      if (name.includes('.')) {
        // Handle nested object properties (e.g., "user.email")
        const [section, field] = name.split('.');
        const currentSection = prev[section] || {};
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: processedValue,
          },
        };
      } else {
        // Handle direct properties
        return {
          ...prev,
          [name]: processedValue,
        };
      }
    });

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate on change if enabled
    if (validateOnChange && validators[name]) {
      validateField(name, processedValue);
    } else {
      // Clear error if it exists
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validateOnChange, validators]);

  // Handle input blur for validation
  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;

    if (validateOnBlur && validators[name]) {
      validateField(name, value);
    }
  }, [validateOnBlur, validators]);

  // Handle input focus for clearing errors
  const handleInputFocus = useCallback((e) => {
    const { name } = e.target;
    
    // Clear error when field gains focus
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Validate individual field
  const validateField = useCallback((name, value) => {
    const validator = validators[name];
    if (!validator) return;

    const error = validator(value, values);
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined,
    }));

    return !error;
  }, [validators, values]);

  // Validate all fields
  const validateAllFields = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validators).forEach(fieldName => {
      const fieldValue = getNestedValue(values, fieldName);
      const error = validators[fieldName](fieldValue, values);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validators, values]);

  // Get nested value from object (e.g., "user.email" from {user: {email: "test"}})
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Set nested value in object
  const setNestedValue = useCallback((path, value) => {
    setValues(prev => {
      if (path.includes('.')) {
        const [section, field] = path.split('.');
        const currentSection = prev[section] || {};
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: value,
          },
        };
      } else {
        return {
          ...prev,
          [path]: value,
        };
      }
    });
  }, []);

  // Reset form
  const resetForm = useCallback((newInitialState = initialState) => {
    setValues(newInitialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  // Register input ref for programmatic focus
  const registerRef = useCallback((name, ref) => {
    inputRefs.current[name] = ref;
  }, []);

  // Focus specific field
  const focusField = useCallback((name) => {
    const ref = inputRefs.current[name];
    if (ref) {
      ref.focus();
    }
  }, []);

  // Navigate to next field
  const focusNextField = useCallback((currentFieldName, fieldOrder = []) => {
    const currentIndex = fieldOrder.indexOf(currentFieldName);
    if (currentIndex !== -1 && currentIndex < fieldOrder.length - 1) {
      const nextField = fieldOrder[currentIndex + 1];
      focusField(nextField);
    }
  }, [focusField]);

  // Navigate to previous field
  const focusPreviousField = useCallback((currentFieldName, fieldOrder = []) => {
    const currentIndex = fieldOrder.indexOf(currentFieldName);
    if (currentIndex > 0) {
      const previousField = fieldOrder[currentIndex - 1];
      focusField(previousField);
    }
  }, [focusField]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e, fieldOrder = []) => {
    const { name } = e.target;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        focusNextField(name, fieldOrder);
        break;
      case 'ArrowDown':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          focusNextField(name, fieldOrder);
        }
        break;
      case 'ArrowUp':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          focusPreviousField(name, fieldOrder);
        }
        break;
      default:
        break;
    }
  }, [focusNextField, focusPreviousField]);

  // Get input props for a field
  const getInputProps = useCallback((name, options = {}) => {
    const {
      type = 'text',
      fieldOrder = [],
      ...otherOptions
    } = options;

    const value = getNestedValue(values, name);
    const error = errors[name];
    const isTouched = touched[name];

    return {
      name,
      type,
      value: value || (type === 'checkbox' ? false : ''),
      checked: type === 'checkbox' ? Boolean(value) : undefined,
      onChange: handleInputChange,
      onBlur: handleInputBlur,
      onFocus: handleInputFocus,
      onKeyDown: fieldOrder.length > 0 ? (e) => handleKeyDown(e, fieldOrder) : undefined,
      ref: (ref) => registerRef(name, ref),
      'aria-invalid': Boolean(error),
      'aria-describedby': error ? `${name}-error` : undefined,
      ...otherOptions,
    };
  }, [values, errors, touched, handleInputChange, handleInputBlur, handleInputFocus, handleKeyDown, registerRef]);

  // Convert string numbers to actual numbers for API submission
  const getProcessedValues = useCallback(() => {
    const processed = { ...values };

    // Process nested objects
    Object.keys(processed).forEach(key => {
      if (typeof processed[key] === 'object' && processed[key] !== null) {
        Object.keys(processed[key]).forEach(nestedKey => {
          const value = processed[key][nestedKey];
          // Convert string numbers to actual numbers
          if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
            processed[key][nestedKey] = Number(value);
          }
        });
      } else {
        // Convert top-level string numbers to actual numbers
        const value = processed[key];
        if (typeof value === 'string' && !isNaN(value) && value.trim() !== '') {
          processed[key] = Number(value);
        }
      }
    });

    return processed;
  }, [values]);

  return {
    // Values and state
    values,
    errors,
    touched,
    
    // Event handlers
    handleInputChange,
    handleInputBlur,
    handleInputFocus,
    handleKeyDown,
    
    // Validation
    validateField,
    validateAllFields,
    
    // Utilities
    setValues,
    setNestedValue,
    resetForm,
    getNestedValue,
    getProcessedValues,
    
    // Navigation
    focusField,
    focusNextField,
    focusPreviousField,
    registerRef,
    
    // Convenience
    getInputProps,
    
    // State checkers
    hasErrors: Object.keys(errors).length > 0,
    isValid: Object.keys(errors).length === 0,
    isDirty: Object.keys(touched).length > 0,
  };
};

export default useFormInput;
