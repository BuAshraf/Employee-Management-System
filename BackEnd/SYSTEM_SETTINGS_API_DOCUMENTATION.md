# System Settings Backend API Documentation

## Overview
The EMS System Settings backend provides comprehensive management for all system configuration including General Settings, Security Settings, Email Settings, Notification Settings, and Backup Settings.

## API Endpoints

### Base URL: `/api/settings`

---

## 🔧 **General Settings Management**

### 1. Get Current System Settings
- **Endpoint**: `GET /api/settings/system`
- **Permission**: `ADMIN` or `SUPER_ADMIN`
- **Description**: Retrieves current system settings or creates default settings if none exist

**Response Example**:
```json
{
  "success": true,
  "message": "Settings retrieved successfully",
  "data": {
    "companyName": "Employee Management System",
    "companyEmail": "admin@ems.com",
    "companyPhone": "+1 (555) 123-4567",
    "companyAddress": "123 Business Ave, Tech City, TC 12345",
    "defaultVacationDays": 20,
    "currency": "USD",
    "dateFormat": "MM/DD/YYYY",
    "timezone": "America/New_York",
    "notifications": {
      "emailNotifications": true,
      "newEmployeeAlerts": true,
      "salaryUpdateAlerts": false,
      "systemMaintenance": true
    },
    "backup": {
      "autoBackup": true,
      "backupFrequency": "weekly",
      "retentionPeriod": 30
    },
    "security": {
      "passwordMinLength": 8,
      "requireSpecialChars": true,
      "requireNumbers": true,
      "requireUppercase": true,
      "sessionTimeout": 30,
      "twoFactorRequired": false,
      "loginAttempts": 5,
      "lockoutDuration": 15
    },
    "email": {
      "smtpHost": "smtp.gmail.com",
      "smtpPort": 587,
      "smtpUsername": "noreply@ems.com",
      "fromName": "EMS HR",
      "fromEmail": "hr@ems.com",
      "enableSSL": true
    }
  },
  "lastUpdated": "2025-07-28T10:30:00"
}
```

### 2. Update System Settings
- **Endpoint**: `PUT /api/settings/system`
- **Permission**: `ADMIN` or `SUPER_ADMIN`
- **Description**: Updates system settings with validation

**Request Body**:
```json
{
  "companyName": "Updated Company Name",
  "companyEmail": "admin@newcompany.com",
  "companyPhone": "+1 (555) 987-6543",
  "companyAddress": "456 New Business Blvd, Tech City, TC 54321",
  "defaultVacationDays": 25,
  "currency": "EUR",
  "dateFormat": "DD/MM/YYYY",
  "timezone": "Europe/London",
  "notifications": {
    "emailNotifications": true,
    "newEmployeeAlerts": true,
    "salaryUpdateAlerts": true,
    "systemMaintenance": true
  },
  "backup": {
    "autoBackup": true,
    "backupFrequency": "daily",
    "retentionPeriod": 60
  },
  "security": {
    "passwordMinLength": 10,
    "requireSpecialChars": true,
    "requireNumbers": true,
    "requireUppercase": true,
    "sessionTimeout": 45,
    "twoFactorRequired": true,
    "loginAttempts": 3,
    "lockoutDuration": 30
  },
  "email": {
    "smtpHost": "smtp.company.com",
    "smtpPort": 465,
    "smtpUsername": "notifications@company.com",
    "smtpPassword": "securepassword",
    "fromName": "Company HR",
    "fromEmail": "hr@company.com",
    "enableSSL": true
  }
}
```

---

## 🔒 **Security Settings Management**

### Security Settings Validation Rules:
- **Password Min Length**: 6-20 characters
- **Session Timeout**: 5-120 minutes
- **Login Attempts**: 3-10 attempts
- **Lockout Duration**: 5-60 minutes

---

## 📧 **Email Settings Management**

### Email Settings Validation Rules:
- **SMTP Port**: 1-65535
- **Email Format**: Valid email format required
- **SMTP Host**: Required for email functionality

### 3. Send Test Email
- **Endpoint**: `POST /api/settings/system/send-test-email`
- **Permission**: `ADMIN` or `SUPER_ADMIN`
- **Description**: Sends a test email to verify email configuration

**Request Body**:
```json
{
  "testEmail": "test@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Test email sent successfully"
}
```

---

## 🔔 **Notification Settings Management**

### Available Notification Types:
- **Email Notifications**: General email notifications
- **New Employee Alerts**: Notifications for new team members
- **Salary Update Alerts**: Notifications for salary changes
- **System Maintenance**: System maintenance notifications

---

## 💾 **Backup Settings Management**

### Backup Settings Validation Rules:
- **Retention Period**: 1-365 days
- **Backup Frequency**: daily, weekly, monthly

### 4. Create Manual Backup
- **Endpoint**: `POST /api/settings/system/create-backup`
- **Permission**: `ADMIN` or `SUPER_ADMIN`
- **Description**: Creates an immediate backup of the system

**Response**:
```json
{
  "success": true,
  "message": "Backup created successfully"
}
```

---

## 🔄 **System Management**

### 5. Reset Settings to Defaults
- **Endpoint**: `POST /api/settings/system/reset`
- **Permission**: `ADMIN` or `SUPER_ADMIN`
- **Description**: Resets all settings to default values

**Response**:
```json
{
  "success": true,
  "message": "Settings reset to defaults successfully"
}
```

### 6. Clear System Cache
- **Endpoint**: `POST /api/settings/system/clear-cache`
- **Permission**: `ADMIN` or `SUPER_ADMIN`
- **Description**: Clears system cache for improved performance

**Response**:
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

### 7. Get System Information
- **Endpoint**: `GET /api/settings/system/info`
- **Permission**: `ADMIN` or `SUPER_ADMIN`
- **Description**: Retrieves system information for monitoring

**Response**:
```json
{
  "version": "v2.1.0",
  "database": "MySQL 8.0",
  "lastBackup": "2 hours ago",
  "uptime": "15 days, 4 hours",
  "storageUsed": "2.4 GB / 10 GB",
  "activeUsers": "24"
}
```

---

## 🛡️ **Validation Rules Summary**

### General Settings:
- **Company Name**: 2-255 characters, required
- **Company Email**: Valid email format, required
- **Default Vacation Days**: 0-365 days

### Security Settings:
- **Password Min Length**: 6-20 characters
- **Session Timeout**: 5-120 minutes
- **Login Attempts**: 3-10 attempts
- **Lockout Duration**: 5-60 minutes

### Email Settings:
- **SMTP Port**: 1-65535
- **From Email**: Valid email format

### Backup Settings:
- **Retention Period**: 1-365 days

---

## 📁 **Backend File Structure**

```
src/main/java/com/ems/ems_backend/
├── model/
│   └── SystemSettings.java          # Entity with validation annotations
├── repository/
│   └── SystemSettingsRepository.java # Data access layer
├── service/
│   └── SystemSettingsService.java   # Business logic
├── controller/
│   └── SystemSettingsController.java # REST endpoints
└── dto/
    ├── SystemSettingsRequest.java   # Request DTO
    ├── SystemSettingsResponse.java  # Response DTO
    ├── NotificationSettingsRequest.java
    ├── BackupSettingsRequest.java
    ├── SecuritySettingsRequest.java
    └── EmailSettingsRequest.java
```

---

## 🚀 **Features**

✅ **Complete CRUD Operations** for all settings  
✅ **Comprehensive Validation** with proper error messages  
✅ **Security Controls** with role-based access  
✅ **Audit Trail** with created/updated timestamps and user tracking  
✅ **Default Settings** automatic creation  
✅ **Test Email Functionality**  
✅ **Manual Backup Creation**  
✅ **Cache Management**  
✅ **System Information Monitoring**  
✅ **Settings Reset Functionality**  

---

## 🔧 **Database Schema**

The `system_settings` table includes all necessary fields with proper constraints and indexes for optimal performance.

## 🎯 **Usage Examples**

### Frontend Integration:
```javascript
// Get current settings
const response = await systemSettingsService.getSystemSettings();

// Update settings
const updateResponse = await systemSettingsService.updateSystemSettings(formData);

// Send test email
const testEmailResponse = await systemSettingsService.sendTestEmail('test@example.com');

// Create backup
const backupResponse = await systemSettingsService.createManualBackup();

// Clear cache
const cacheResponse = await systemSettingsService.clearCache();

// Reset settings
const resetResponse = await systemSettingsService.resetSettings();
```

The backend is **production-ready** with comprehensive validation, error handling, security controls, and full functionality for managing all system settings!
