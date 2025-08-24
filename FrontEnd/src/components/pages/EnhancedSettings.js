import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, AlertTriangle, Check, Loader, Mail, Database } from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import timezones from 'timezones-list';
import systemSettingsService from '../../services/SystemSettingsService';

// Import our enhanced form components
import useFormInput from '../../hooks/useFormInput';
import FormInput from '../common/FormInput';
import FormSelect from '../common/FormSelect';
import FormTextarea from '../common/FormTextarea';
import FormCheckbox from '../common/FormCheckbox';
import { validationSchemas } from '../../utils/validation';

const EnhancedSettings = () => {
  const { theme, setTheme } = useTheme();
  const { lang, t } = useI18n();
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  // Define field order for keyboard navigation
  const fieldOrder = {
    general: [
      'companyName',
      'companyEmail', 
      'companyPhone',
      'timezone',
      'companyAddress',
      'dateFormat',
      'currency',
      'defaultVacationDays'
    ],
    security: [
      'security.passwordMinLength',
      'security.sessionTimeout',
      'security.requireSpecialChars',
      'security.requireNumbers',
      'security.twoFactorRequired',
      'security.loginAttempts',
      'security.lockoutDuration'
    ],
    email: [
      'email.smtpHost',
      'email.smtpPort',
      'email.smtpUsername',
      'email.smtpPassword',
      'email.enableSSL',
      'email.fromName',
      'email.fromEmail'
    ],
    notifications: [
      'notifications.emailNotifications',
      'notifications.newEmployeeAlerts',
      'notifications.salaryUpdateAlerts',
      'notifications.systemMaintenance'
    ],
    backup: [
      'backup.autoBackup',
      'backup.backupFrequency',
      'backup.retentionPeriod'
    ]
  };

  // Initialize form with default values and validation
  const form = useFormInput(
    {
      companyName: 'Employee Management System',
      companyEmail: 'admin@ems.com',
      companyPhone: '+1 (555) 123-4567',
      companyAddress: '123 Business Ave, Tech City, TC 12345',
      defaultVacationDays: 20,
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      timezone: 'America/New_York',
      notifications: {
        emailNotifications: true,
        newEmployeeAlerts: true,
        salaryUpdateAlerts: false,
        systemMaintenance: true,
      },
      backup: {
        autoBackup: true,
        backupFrequency: 'weekly',
        retentionPeriod: 30,
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
        smtpUsername: 'noreply@ems.com',
        smtpPassword: '••••••••••••',
        fromName: 'EMS HR',
        fromEmail: 'hr@ems.com',
        enableSSL: true
      }
    },
    {
      validateOnBlur: true,
      validators: validationSchemas.systemSettings
    }
  );

  // Load settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await systemSettingsService.getSystemSettings();
        
        if (response.success && response.data) {
          form.setValues(response.data);
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
  }, []);

  // Save settings
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    if (!form.validateAllFields()) {
      toast.error('Please fix the validation errors before saving');
      return;
    }

    setIsSaving(true);

    try {
      const processedValues = form.getProcessedValues();
      const response = await systemSettingsService.updateSystemSettings(processedValues);
      
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
      toast.error(error.response?.data?.message || error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset settings
  const handleReset = async () => {
    if (window.confirm(t('resetConfirm'))) {
      try {
        setIsSaving(true);
        const response = await systemSettingsService.resetSettings();
        
        if (response.success && response.data) {
          form.setValues(response.data);
          setLastSaved(new Date().toISOString());
          toast.success(t('resetSuccess'));
        }
      } catch (error) {
        console.error('Error resetting settings:', error);
        toast.error('Failed to reset settings');
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Test email
  const handleTestEmail = async () => {
    try {
      const testEmail = prompt('Enter email address to send test email to:');
      if (!testEmail) return;

      toast.info('Sending test email...');
      const response = await systemSettingsService.sendTestEmail(testEmail);
      
      if (response.success) {
        toast.success('Test email sent successfully!');
      } else {
        throw new Error(response.message || 'Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    }
  };

  // Create backup
  const handleCreateBackup = async () => {
    try {
      toast.info('Creating backup...');
      const response = await systemSettingsService.createManualBackup();
      
      if (response.success) {
        toast.success('Backup created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    }
  };

  // Prepare options for select components
  const timezoneOptions = timezones.map(tz => ({
    value: tz.tzCode,
    label: `${tz.label} (${tz.name})`
  }));

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'SAR', label: 'SAR - Saudi Riyal' }
  ];

  const backupFrequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
    { id: 'email', label: 'Email' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'backup', label: 'Backup' }
  ];

  const GeneralTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Company Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            {...form.getInputProps('companyName', { fieldOrder: fieldOrder.general })}
            label="Company Name"
            required
            error={form.errors.companyName}
            touched={form.touched.companyName}
          />

          <FormInput
            {...form.getInputProps('companyEmail', { type: 'email', fieldOrder: fieldOrder.general })}
            label="Company Email"
            required
            error={form.errors.companyEmail}
            touched={form.touched.companyEmail}
          />

          <FormInput
            {...form.getInputProps('companyPhone', { type: 'tel', fieldOrder: fieldOrder.general })}
            label="Phone Number"
            error={form.errors.companyPhone}
            touched={form.touched.companyPhone}
          />

          <FormSelect
            {...form.getInputProps('timezone', { fieldOrder: fieldOrder.general })}
            label="Timezone"
            options={timezoneOptions}
            error={form.errors.timezone}
            touched={form.touched.timezone}
          />
        </div>

        <div className="mt-6">
          <FormTextarea
            {...form.getInputProps('companyAddress', { fieldOrder: fieldOrder.general })}
            label="Company Address"
            rows={3}
            error={form.errors.companyAddress}
            touched={form.touched.companyAddress}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Localization & Employee Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormSelect
            {...form.getInputProps('dateFormat', { fieldOrder: fieldOrder.general })}
            label="Date Format"
            options={dateFormatOptions}
            error={form.errors.dateFormat}
            touched={form.touched.dateFormat}
          />

          <FormSelect
            {...form.getInputProps('currency', { fieldOrder: fieldOrder.general })}
            label="Currency"
            options={currencyOptions}
            error={form.errors.currency}
            touched={form.touched.currency}
          />

          <FormInput
            {...form.getInputProps('defaultVacationDays', { type: 'number', min: 0, max: 365, fieldOrder: fieldOrder.general })}
            label="Default Vacation Days"
            error={form.errors.defaultVacationDays}
            touched={form.touched.defaultVacationDays}
          />
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Password Policy</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            {...form.getInputProps('security.passwordMinLength', { type: 'number', min: 6, max: 20, fieldOrder: fieldOrder.security })}
            label="Minimum Password Length"
            error={form.errors['security.passwordMinLength']}
            touched={form.touched['security.passwordMinLength']}
          />

          <FormInput
            {...form.getInputProps('security.sessionTimeout', { type: 'number', min: 5, max: 120, fieldOrder: fieldOrder.security })}
            label="Session Timeout (minutes)"
            error={form.errors['security.sessionTimeout']}
            touched={form.touched['security.sessionTimeout']}
          />
        </div>

        <div className="mt-6 space-y-4">
          <FormCheckbox
            {...form.getInputProps('security.requireSpecialChars', { fieldOrder: fieldOrder.security })}
            type="toggle"
            label="Require Special Characters"
            description="Passwords must contain special characters"
            error={form.errors['security.requireSpecialChars']}
            touched={form.touched['security.requireSpecialChars']}
          />

          <FormCheckbox
            {...form.getInputProps('security.requireNumbers', { fieldOrder: fieldOrder.security })}
            type="toggle"
            label="Require Numbers"
            description="Passwords must contain numbers"
            error={form.errors['security.requireNumbers']}
            touched={form.touched['security.requireNumbers']}
          />

          <FormCheckbox
            {...form.getInputProps('security.twoFactorRequired', { fieldOrder: fieldOrder.security })}
            type="toggle"
            label="Two-Factor Authentication Required"
            description="Require 2FA for all users"
            error={form.errors['security.twoFactorRequired']}
            touched={form.touched['security.twoFactorRequired']}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Account Lockout</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            {...form.getInputProps('security.loginAttempts', { type: 'number', min: 3, max: 10, fieldOrder: fieldOrder.security })}
            label="Max Login Attempts"
            error={form.errors['security.loginAttempts']}
            touched={form.touched['security.loginAttempts']}
          />

          <FormInput
            {...form.getInputProps('security.lockoutDuration', { type: 'number', min: 5, max: 60, fieldOrder: fieldOrder.security })}
            label="Lockout Duration (minutes)"
            error={form.errors['security.lockoutDuration']}
            touched={form.touched['security.lockoutDuration']}
          />
        </div>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">System Settings</h1>
            <p className="text-slate-600 mt-1">Configure system-wide settings and preferences</p>
            {lastSaved && (
              <p className="text-sm text-slate-500 mt-1">
                Last saved: {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {savedMessage && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg"
              >
                <Check size={16} className="mr-2" />
                {savedMessage}
              </motion.div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving || form.hasErrors}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
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
              {/* Add other tabs as needed */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettings;
