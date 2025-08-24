import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Database,
  Mail,
  Save,
  RefreshCw,
  AlertTriangle,
  Check,
  Loader,
  
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import timezones from 'timezones-list';
import systemSettingsService from '../../services/SystemSettingsService';
// import useFormInput from '../../hooks/useFormInput';
// Validation utilities not used directly here
// import { validationSchemas, validateRequired, validateNumberRange, validateEmail } from '../../utils/validation';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { lang, t } = useI18n();
  // Auth removed
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  const [settings, setSettings] = useState({
    companyName: 'Employee Management System',
    companyEmail: 'employeemanagementsysteme@gmail.com',
    companyPhone: '+966 (54) 718-7859',
    companyAddress: '123 Riyadh, Riyadh, RD 12345',
    defaultVacationDays: 30,
    currency: 'SAR',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
    timezone: 'Asia/Riyadh',
    notifications: {
      emailNotifications: true,
      newEmployeeAlerts: true,
      salaryUpdateAlerts: true,
      systemMaintenance: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'weekly',
      retentionPeriod: '30',
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      sessionTimeout: 30,
      twoFactorRequired: false,
      loginAttempts: 5,
      lockoutDuration: 15
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUsername: 'employeemanagementsysteme@gmail.com',
      smtpPassword: '••••••••••••',
      fromName: 'EMS HR',
      fromEmail: 'employeemanagementsysteme@gmail.com',
      enableSSL: true
    }
  });

  const tabs = [
    { id: 'general', label: t('general'), icon: SettingsIcon },
    { id: 'security', label: t('security'), icon: Shield },
    { id: 'email', label: t('email'), icon: Mail },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'backup', label: t('backup'), icon: Database }
  ];

  // Load settings from backend on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await systemSettingsService.getSystemSettings();

        if (response.success && response.data) {
          // Create default structure first
          const defaultSettings = {
            companyName: 'Employee Management System',
            companyEmail: 'employeemanagementsysteme@gmail.com',
            companyPhone: '+966 (54) 718-7859',
            companyAddress: '123 Riyadh, Riyadh, RD 12345',
            defaultVacationDays: 30,
            currency: 'SAR',
            dateFormat: 'MM/DD/YYYY',
            theme: 'light',
            timezone: 'Asia/Riyadh',
            notifications: {
              emailNotifications: true,
              newEmployeeAlerts: true,
              salaryUpdateAlerts: true,
              systemMaintenance: true,
            },
            backup: {
              autoBackup: true,
              backupFrequency: 'weekly',
              retentionPeriod: '30',
            },
            security: {
              passwordMinLength: 8,
              requireSpecialChars: true,
              requireNumbers: true,
              requireUppercase: true,
              sessionTimeout: 30,
              twoFactorRequired: false,
              loginAttempts: 5,
              lockoutDuration: 15
            },
            email: {
              smtpHost: 'smtp.gmail.com',
              smtpPort: 587,
              smtpUsername: 'employeemanagementsysteme@gmail.com',
              smtpPassword: '••••••••••••',
              fromName: 'EMS HR',
              fromEmail: 'employeemanagementsysteme@gmail.com',
              enableSSL: true
            }
          };
          // Ensure all nested objects exist with fallbacks
          const loadedSettings = {
            ...defaultSettings,
            ...response.data,
            notifications: {
              ...defaultSettings.notifications,
              ...response.data.notifications,
            },
            backup: {
              ...defaultSettings.backup,
              ...response.data.backup,
            },
            security: {
              ...defaultSettings.security,
              ...response.data.security,
            },
            email: {
              ...defaultSettings.email,
              ...response.data.email,
            },
          };

          setSettings(loadedSettings);
          setLastSaved(response.lastUpdated);
        }
      } catch (error) {
        console.error('Failed to load system settings:', error);
        toast.error(t('failedToLoadSettings') || 'Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [t]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    let processedValue;
    if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'number') {
      // Keep the raw value for number inputs to allow typing
      processedValue = value;
    } else {
      processedValue = value;
    }

    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setSettings(prev => {
        // Ensure the section exists
        const currentSection = prev[section] || {};
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [field]: processedValue,
          },
        };
      });
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: processedValue,
      }));
    }
  }, []); // Empty dependency array since we don't use any external values

  // Validate settings before saving
  const validateSettings = (settingsToValidate) => {
    const errors = [];

    // Company information validation
    if (!settingsToValidate.companyName?.trim()) {
      errors.push(t('companyNameRequired') || 'Company name is required');
    }
    if (!settingsToValidate.companyEmail?.trim()) {
      errors.push(t('companyEmailRequired') || 'Company email is required');
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (settingsToValidate.companyEmail && !emailPattern.test(settingsToValidate.companyEmail)) {
      errors.push(t('invalidEmail') || 'Invalid email format');
    }

    // Number validation - convert strings to numbers for validation
    const vacationDays = parseInt(settingsToValidate.defaultVacationDays, 10);
    if (settingsToValidate.defaultVacationDays && !isNaN(vacationDays) && (vacationDays < 0 || vacationDays > 365)) {
      errors.push(t('invalidVacationDays') || 'Vacation days must be between 0 and 365');
    }

    // Security validation - convert strings to numbers for validation
    const passwordMinLength = parseInt(settingsToValidate.security?.passwordMinLength, 10);
    if (settingsToValidate.security?.passwordMinLength && !isNaN(passwordMinLength) && (passwordMinLength < 6 || passwordMinLength > 20)) {
      errors.push(t('invalidPasswordLength') || 'Password length must be between 6 and 20');
    }

    const sessionTimeout = parseInt(settingsToValidate.security?.sessionTimeout, 10);
    if (settingsToValidate.security?.sessionTimeout && !isNaN(sessionTimeout) && (sessionTimeout < 5 || sessionTimeout > 120)) {
      errors.push(t('invalidSessionTimeout') || 'Session timeout must be between 5 and 120 minutes');
    }

    return errors;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    // Convert string numbers to actual numbers before validation and saving
    const processedSettings = {
      ...settings,
      defaultVacationDays: settings.defaultVacationDays ? parseInt(settings.defaultVacationDays, 10) : settings.defaultVacationDays,
      security: {
        ...settings.security,
        passwordMinLength: settings.security?.passwordMinLength ? parseInt(settings.security.passwordMinLength, 10) : settings.security?.passwordMinLength,
        sessionTimeout: settings.security?.sessionTimeout ? parseInt(settings.security.sessionTimeout, 10) : settings.security?.sessionTimeout,
        loginAttempts: settings.security?.loginAttempts ? parseInt(settings.security.loginAttempts, 10) : settings.security?.loginAttempts,
        lockoutDuration: settings.security?.lockoutDuration ? parseInt(settings.security.lockoutDuration, 10) : settings.security?.lockoutDuration,
      },
      email: {
        ...settings.email,
        smtpPort: settings.email?.smtpPort ? parseInt(settings.email.smtpPort, 10) : settings.email?.smtpPort,
      },
      backup: {
        ...settings.backup,
        retentionPeriod: settings.backup?.retentionPeriod ? parseInt(settings.backup.retentionPeriod, 10) : settings.backup?.retentionPeriod,
      },
    };

    // Validate settings before saving
    const validationErrors = validateSettings(processedSettings);
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setIsSaving(true);

    try {
      // Save processed settings to backend
      const response = await systemSettingsService.updateSystemSettings(processedSettings);

      if (response.success) {
        setLastSaved(new Date().toISOString());
        setSavedMessage(t('settingsSaved'));
        setTimeout(() => setSavedMessage(''), 3000);
        toast.success(t('settingsSaved'));
      } else {
        throw new Error(response.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.response?.data?.message || error.message || t('failedToSaveSettings') || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm(t('resetConfirm'))) {
      try {
        setIsSaving(true);
        const response = await systemSettingsService.resetSettings();

        if (response.success && response.data) {
          setSettings(response.data);
          setLastSaved(new Date().toISOString());
          toast.success(t('resetSuccess'));
        } else {
          throw new Error(response.message || 'Failed to reset settings');
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        toast.error(error.response?.data?.message || error.message || t('failedToResetSettings') || 'Failed to reset settings');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleTestEmail = async () => {
    try {
      const testEmail = prompt(t('enterTestEmail') || 'Enter email address to send test email to:');
      if (!testEmail) return;

      toast.info(t('sendingTestEmail') || 'Sending test email...');
      const response = await systemSettingsService.sendTestEmail(testEmail);

      if (response.success) {
        toast.success(t('testEmailSent') || 'Test email sent successfully!');
      } else {
        throw new Error(response.message || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error(error.response?.data?.message || error.message || t('failedToSendTestEmail') || 'Failed to send test email');
    }
  };

  const handleCreateBackup = async () => {
    try {
      toast.info(t('creatingBackup') || 'Creating backup...');
      const response = await systemSettingsService.createManualBackup();

      if (response.success) {
        toast.success(t('backupCreated') || 'Backup created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error(error.response?.data?.message || error.message || t('failedToCreateBackup') || 'Failed to create backup');
    }
  };

  const handleClearCache = async () => {
    try {
      toast.info(t('clearingCache') || 'Clearing cache...');
      const response = await systemSettingsService.clearCache();

      if (response.success) {
        toast.success(t('cacheCleared') || 'Cache cleared successfully!');
      } else {
        throw new Error(response.message || 'Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error(error.response?.data?.message || error.message || t('failedToClearCache') || 'Failed to clear cache');
    }
  };

  const GeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('companyInformation')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('companyName')}</label>
            <input
              type="text"
              value={settings.companyName || ''}
              onChange={(e) => handleInputChange(e)}
              name="companyName"
              required
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('companyEmail')}</label>
            <input
              type="email"
              value={settings.companyEmail || ''}
              onChange={(e) => handleInputChange(e)}
              name="companyEmail"
              required
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('phoneNumber')}</label>
            <input
              type="tel"
              value={settings.companyPhone || ''}
              onChange={(e) => handleInputChange(e)}
              name="companyPhone"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('timezone')}</label>
            <select
              value={settings.timezone || 'UTC'}
              onChange={(e) => handleInputChange(e)}
              name="timezone"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timezones.map((timezone) => (
                <option key={timezone.tzCode} value={timezone.tzCode}>
                  {timezone.label} ({timezone.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('companyAddress')}</label>
          <textarea
            value={settings.companyAddress || ''}
            onChange={(e) => handleInputChange(e)}
            name="companyAddress"
            rows={3}
            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('localizationEmployeeSettings')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('dateFormat')}</label>
            <select
              value={settings.dateFormat || 'MM/DD/YYYY'}
              onChange={(e) => handleInputChange(e)}
              name="dateFormat"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('currency')}</label>
            <select
              value={settings.currency || 'USD'}
              onChange={(e) => handleInputChange(e)}
              name="currency"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="SAR">SAR - Saudi Riyal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('defaultVacationDays')}</label>
            <input
              type="number"
              value={settings.defaultVacationDays || ''}
              onChange={(e) => handleInputChange(e)}
              name="defaultVacationDays"
              min="0"
              max="365"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('theme')}</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            name="theme"
            className="w-full md:w-1/3 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="light">{t('lightMode')}</option>
            <option value="dark">{t('darkMode')}</option>
            <option value="auto">{t('autoMode')}</option>
          </select>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('passwordPolicy')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('minimumPasswordLength')}</label>
            <input
              type="number"
              min="6"
              max="20"
              value={settings.security?.passwordMinLength || ''}
              onChange={(e) => handleInputChange(e)}
              name="security.passwordMinLength"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('sessionTimeout')}</label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.security?.sessionTimeout || ''}
              onChange={(e) => handleInputChange(e)}
              name="security.sessionTimeout"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-800">{t('requireSpecialChars')}</h4>
              <p className="text-sm text-slate-600">{t('requireSpecialCharsDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security?.requireSpecialChars || false}
                onChange={(e) => handleInputChange(e)}
                name="security.requireSpecialChars"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-800">{t('requireNumbers')}</h4>
              <p className="text-sm text-slate-600">{t('requireNumbersDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security?.requireNumbers || false}
                onChange={(e) => handleInputChange(e)}
                name="security.requireNumbers"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-800">{t('twoFactorAuthRequired')}</h4>
              <p className="text-sm text-slate-600">{t('twoFactorAuthDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security?.twoFactorRequired || false}
                onChange={(e) => handleInputChange(e)}
                name="security.twoFactorRequired"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('accountLockout')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('maxLoginAttempts')}</label>
            <input
              type="number"
              min="3"
              max="10"
              value={settings.security?.loginAttempts || ''}
              onChange={(e) => handleInputChange(e)}
              name="security.loginAttempts"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('lockoutDuration')}</label>
            <input
              type="number"
              min="5"
              max="60"
              value={settings.security?.lockoutDuration || ''}
              onChange={(e) => handleInputChange(e)}
              name="security.lockoutDuration"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const EmailTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('smtpConfiguration')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('smtpHost')}</label>
            <input
              type="text"
              value={settings.email?.smtpHost || ''}
              onChange={(e) => handleInputChange(e)}
              name="email.smtpHost"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('smtpPort')}</label>
            <input
              type="number"
              value={settings.email?.smtpPort || ''}
              onChange={(e) => handleInputChange(e)}
              name="email.smtpPort"
              min="1"
              max="65535"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('smtpUsername')}</label>
            <input
              type="text"
              value={settings.email?.smtpUsername || ''}
              onChange={(e) => handleInputChange(e)}
              name="email.smtpUsername"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('smtpPassword')}</label>
            <input
              type="password"
              value={settings.email?.smtpPassword || ''}
              onChange={(e) => handleInputChange(e)}
              name="email.smtpPassword"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-800">{t('enableSSL')}</h4>
              <p className="text-sm text-slate-600">{t('secureConnection')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.email?.enableSSL || false}
                onChange={(e) => handleInputChange(e)}
                name="email.enableSSL"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('emailTemplates')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('fromName')}</label>
            <input
              type="text"
              value={settings.email?.fromName || ''}
              onChange={(e) => handleInputChange(e)}
              name="email.fromName"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('fromEmail')}</label>
            <input
              type="email"
              value={settings.email?.fromEmail || ''}
              onChange={(e) => handleInputChange(e)}
              name="email.fromEmail"
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleTestEmail}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail size={16} className="mr-2" />
            {t('sendTestEmail') || 'Send Test Email'}
          </button>
        </div>
      </div>
    </div>
  );

  const NotificationsTab = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('emailNotifications')}</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h4 className="font-medium text-slate-800">{t('emailNotifications')}</h4>
            <p className="text-sm text-slate-600">{t('emailNotificationsDesc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications?.emailNotifications || false}
              onChange={(e) => handleInputChange(e)}
              name="notifications.emailNotifications"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h4 className="font-medium text-slate-800">{t('newEmployeeAlerts')}</h4>
            <p className="text-sm text-slate-600">{t('newEmployeeAlertsDesc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications?.newEmployeeAlerts || false}
              onChange={(e) => handleInputChange(e)}
              name="notifications.newEmployeeAlerts"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h4 className="font-medium text-slate-800">{t('salaryUpdateAlerts')}</h4>
            <p className="text-sm text-slate-600">{t('salaryUpdateAlertsDesc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications?.salaryUpdateAlerts || false}
              onChange={(e) => handleInputChange(e)}
              name="notifications.salaryUpdateAlerts"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div>
            <h4 className="font-medium text-slate-800">{t('systemMaintenance')}</h4>
            <p className="text-sm text-slate-600">{t('systemMaintenanceDesc')}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications?.systemMaintenance || false}
              onChange={(e) => handleInputChange(e)}
              name="notifications.systemMaintenance"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const BackupSystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('backupSettings')}</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-800">{t('enableAutoBackup')}</h4>
              <p className="text-sm text-slate-600">{t('autoBackupDesc')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.backup?.autoBackup || false}
                onChange={(e) => handleInputChange(e)}
                name="backup.autoBackup"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('backupFrequency')}</label>
            <select
              value={settings.backup?.backupFrequency || 'daily'}
              onChange={(e) => handleInputChange(e)}
              name="backup.backupFrequency"
              disabled={!settings.backup?.autoBackup}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="daily">{t('daily')}</option>
              <option value="weekly">{t('weekly')}</option>
              <option value="monthly">{t('monthly')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('retentionPeriod')}</label>
            <input
              type="number"
              min="1"
              max="365"
              value={settings.backup?.retentionPeriod || ''}
              onChange={(e) => handleInputChange(e)}
              name="backup.retentionPeriod"
              disabled={!settings.backup?.autoBackup}
              className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleCreateBackup}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Database size={16} className="mr-2" />
            {t('createManualBackup')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('systemInformation')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('version')}:</span>
              <span className="font-medium text-slate-800">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('database')}:</span>
              <span className="font-medium text-slate-800">MySQL 8.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('lastBackup')}:</span>
              <span className="font-medium text-slate-800">2 hours ago</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">{t('uptime')}:</span>
              <span className="font-medium text-slate-800">15 days, 4 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('storageUsed')}:</span>
              <span className="font-medium text-slate-800">2.4 GB / 10 GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">{t('activeUsers')}:</span>
              <span className="font-medium text-slate-800">24</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('maintenance')}</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-800">{t('clearCache')}</h4>
              <p className="text-sm text-slate-600">{t('clearCacheDesc')}</p>
            </div>
            <button
              onClick={handleClearCache}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              {t('clearCache') || 'Clear Cache'}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-red-800">{t('resetSystem')}</h4>
              <p className="text-sm text-red-600">{t('resetSystemDesc')}</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <AlertTriangle size={16} className="mr-2" />
              {t('resetSystem')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">{t('loadingSettings') || 'Loading settings...'}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{t('systemSettings')}</h1>
                <p className="text-slate-600 mt-1">{t('systemSettingsDesc')}</p>
                {lastSaved && (
                  <p className="text-sm text-slate-500 mt-1">
                    {t('lastSaved') || 'Last saved'}: {new Date(lastSaved).toLocaleString()}
                  </p>
                )}
              </div>

              <div className={`flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                {savedMessage && (
                  <motion.div
                    initial={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: lang === 'ar' ? -20 : 20 }}
                    className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg"
                  >
                    <Check size={16} className={lang === 'ar' ? 'ml-2' : 'mr-2'} />
                    {savedMessage}
                  </motion.div>
                )}

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`btn btn-outline-primary d-flex align-items-center ${lang === 'ar' ? 'flex-row-reverse' : ''} ${isSaving ? 'disabled' : ''}`}
                >
                  {isSaving ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={`spinner-border spinner-border-sm ${lang === 'ar' ? 'ms-2' : 'me-2'}`}
                      role="status"
                    />
                  ) : (
                    <Save size={16} className={lang === 'ar' ? 'ms-2' : 'me-2'} />
                  )}
                  {isSaving ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </div>

            <div className={`flex flex-col lg:flex-row ${lang === 'ar' ? 'lg:space-x-reverse' : ''} gap-8`}>
              {/* Sidebar */}
              <div className="lg:w-64">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center ${lang === 'ar' ? 'space-x-reverse space-x-3' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}
                      >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'general' && <GeneralTab />}
                  {activeTab === 'security' && <SecurityTab />}
                  {activeTab === 'email' && <EmailTab />}
                  {activeTab === 'notifications' && <NotificationsTab />}
                  {activeTab === 'backup' && <BackupSystemTab />}
                </motion.div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;