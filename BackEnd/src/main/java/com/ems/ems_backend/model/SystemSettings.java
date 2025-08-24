package com.ems.ems_backend.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "system_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Company Information
    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 255, message = "Company name must be between 2 and 255 characters")
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @NotBlank(message = "Company email is required")
    @Email(message = "Invalid email format")
    @Column(name = "company_email", nullable = false)
    private String companyEmail;

    @Column(name = "company_phone")
    private String companyPhone;

    @Column(name = "company_address", columnDefinition = "TEXT")
    private String companyAddress;

    // Localization Settings
    @Min(value = 0, message = "Default vacation days must be at least 0")
    @Max(value = 365, message = "Default vacation days cannot exceed 365")
    @Column(name = "default_vacation_days")
    private Integer defaultVacationDays;

    @Column(name = "currency")
    private String currency;

    @Column(name = "date_format")
    private String dateFormat;

    @Column(name = "theme")
    private String theme;

    @Column(name = "timezone")
    private String timezone;

    // Email Notifications
    @Column(name = "email_notifications")
    private Boolean emailNotifications;

    @Column(name = "new_employee_alerts")
    private Boolean newEmployeeAlerts;

    @Column(name = "salary_update_alerts")
    private Boolean salaryUpdateAlerts;

    @Column(name = "system_maintenance")
    private Boolean systemMaintenance;

    // Backup Settings
    @Column(name = "auto_backup")
    private Boolean autoBackup;

    @Column(name = "backup_frequency")
    private String backupFrequency;

    @Min(value = 1, message = "Retention period must be at least 1 day")
    @Max(value = 365, message = "Retention period cannot exceed 365 days")
    @Column(name = "retention_period")
    private Integer retentionPeriod;

    // Security Settings
    @Min(value = 6, message = "Password minimum length must be at least 6")
    @Max(value = 20, message = "Password minimum length cannot exceed 20")
    @Column(name = "password_min_length")
    private Integer passwordMinLength;

    @Column(name = "require_special_chars")
    private Boolean requireSpecialChars;

    @Column(name = "require_numbers")
    private Boolean requireNumbers;

    @Column(name = "require_uppercase")
    private Boolean requireUppercase;

    @Min(value = 5, message = "Session timeout must be at least 5 minutes")
    @Max(value = 120, message = "Session timeout cannot exceed 120 minutes")
    @Column(name = "session_timeout")
    private Integer sessionTimeout;

    @Column(name = "two_factor_required")
    private Boolean twoFactorRequired;

    @Min(value = 3, message = "Login attempts must be at least 3")
    @Max(value = 10, message = "Login attempts cannot exceed 10")
    @Column(name = "login_attempts")
    private Integer loginAttempts;

    @Min(value = 5, message = "Lockout duration must be at least 5 minutes")
    @Max(value = 60, message = "Lockout duration cannot exceed 60 minutes")
    @Column(name = "lockout_duration")
    private Integer lockoutDuration;

    // Email Configuration
    @Column(name = "smtp_host")
    private String smtpHost;

    @Min(value = 1, message = "SMTP port must be at least 1")
    @Max(value = 65535, message = "SMTP port cannot exceed 65535")
    @Column(name = "smtp_port")
    private Integer smtpPort;

    @Column(name = "smtp_username")
    private String smtpUsername;

    @Column(name = "smtp_password")
    private String smtpPassword;

    @Column(name = "from_name")
    private String fromName;

    @Email(message = "Invalid from email format")
    @Column(name = "from_email")
    private String fromEmail;

    @Column(name = "enable_ssl")
    private Boolean enableSSL;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;
}
