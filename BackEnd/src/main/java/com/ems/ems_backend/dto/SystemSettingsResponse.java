package com.ems.ems_backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingsResponse {
    private boolean success;
    private String message;
    private SystemSettingsDto data;
    private LocalDateTime lastUpdated;

    public SystemSettingsResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class SystemSettingsDto {
    private String companyName;
    private String companyEmail;
    private String companyPhone;
    private String companyAddress;
    private Integer defaultVacationDays;
    private String currency;
    private String dateFormat;
    private String theme;
    private String timezone;
    
    private NotificationSettings notifications;
    private BackupSettings backup;
    private SecuritySettings security;
    private EmailSettings email;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class NotificationSettings {
    private Boolean emailNotifications;
    private Boolean newEmployeeAlerts;
    private Boolean salaryUpdateAlerts;
    private Boolean systemMaintenance;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class BackupSettings {
    private Boolean autoBackup;
    private String backupFrequency;
    private String retentionPeriod;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class SecuritySettings {
    private Integer passwordMinLength;
    private Boolean requireSpecialChars;
    private Boolean requireNumbers;
    private Boolean requireUppercase;
    private Integer sessionTimeout;
    private Boolean twoFactorRequired;
    private Integer loginAttempts;
    private Integer lockoutDuration;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class EmailSettings {
    private String smtpHost;
    private Integer smtpPort;
    private String smtpUsername;
    private String smtpPassword;
    private String fromName;
    private String fromEmail;
    private Boolean enableSSL;
}
