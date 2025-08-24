/**
 * Validation utilities for form inputs
 * Provides common validation functions that work with useFormInput hook
 */

// Email validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return 'Invalid email format';
  return null;
};

// Required field validation
export const validateRequired = (fieldName) => (value) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

// Number range validation
export const validateNumberRange = (min, max, fieldName) => (value) => {
  if (value === '' || value === null || value === undefined) return null;
  
  const numValue = Number(value);
  if (isNaN(numValue)) return `${fieldName} must be a valid number`;
  if (numValue < min || numValue > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }
  return null;
};

// String length validation
export const validateStringLength = (min, max, fieldName) => (value) => {
  if (!value) return null;
  if (value.length < min) return `${fieldName} must be at least ${min} characters`;
  if (value.length > max) return `${fieldName} must be no more than ${max} characters`;
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) return null;
  const phonePattern = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phonePattern.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Invalid phone number format';
  }
  return null;
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return null;
  try {
    new URL(url);
    return null;
  } catch {
    return 'Invalid URL format';
  }
};

// Password strength validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  
  const errors = [];
  if (password.length < 8) errors.push('at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('a lowercase letter');
  if (!/\d/.test(password)) errors.push('a number');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('a special character');
  
  if (errors.length > 0) {
    return `Password must contain ${errors.join(', ')}`;
  }
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (confirmPassword, formValues) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (confirmPassword !== formValues.password) {
    return 'Passwords do not match';
  }
  return null;
};

// Composite validators
export const combineValidators = (...validators) => (value, formValues) => {
  for (const validator of validators) {
    const error = validator(value, formValues);
    if (error) return error;
  }
  return null;
};

// Common validation sets for different field types
export const validationSets = {
  email: combineValidators(validateRequired('Email'), validateEmail),
  
  companyName: validateRequired('Company name'),
  
  phoneOptional: validatePhone,
  
  passwordMinLength: (min, max) => combineValidators(
    validateRequired('Password length'),
    validateNumberRange(min, max, 'Password length')
  ),
  
  sessionTimeout: combineValidators(
    validateRequired('Session timeout'),
    validateNumberRange(5, 120, 'Session timeout')
  ),
  
  vacationDays: combineValidators(
    validateRequired('Vacation days'),
    validateNumberRange(0, 365, 'Vacation days')
  ),
  
  smtpPort: combineValidators(
    validateRequired('SMTP port'),
    validateNumberRange(1, 65535, 'SMTP port')
  ),
  
  retentionPeriod: combineValidators(
    validateRequired('Retention period'),
    validateNumberRange(1, 365, 'Retention period')
  ),
  
  loginAttempts: combineValidators(
    validateRequired('Login attempts'),
    validateNumberRange(3, 10, 'Login attempts')
  ),
  
  lockoutDuration: combineValidators(
    validateRequired('Lockout duration'),
    validateNumberRange(5, 60, 'Lockout duration')
  ),
};

// Validation schemas for different forms
export const validationSchemas = {
  systemSettings: {
    'companyName': validationSets.companyName,
    'companyEmail': validationSets.email,
    'companyPhone': validationSets.phoneOptional,
    'defaultVacationDays': validationSets.vacationDays,
    'security.passwordMinLength': validationSets.passwordMinLength(6, 20),
    'security.sessionTimeout': validationSets.sessionTimeout,
    'security.loginAttempts': validationSets.loginAttempts,
    'security.lockoutDuration': validationSets.lockoutDuration,
    'email.smtpPort': validationSets.smtpPort,
    'backup.retentionPeriod': validationSets.retentionPeriod,
  },
  
  userProfile: {
    'email': validationSets.email,
    'firstName': validateRequired('First name'),
    'lastName': validateRequired('Last name'),
    'phone': validationSets.phoneOptional,
  },
  
  changePassword: {
    'currentPassword': validateRequired('Current password'),
    'newPassword': validatePassword,
    'confirmPassword': validateConfirmPassword,
  },
};

export default {
  validateEmail,
  validateRequired,
  validateNumberRange,
  validateStringLength,
  validatePhone,
  validateUrl,
  validatePassword,
  validateConfirmPassword,
  combineValidators,
  validationSets,
  validationSchemas,
};
