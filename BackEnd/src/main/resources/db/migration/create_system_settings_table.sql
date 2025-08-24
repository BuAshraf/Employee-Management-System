-- System Settings Table Migration
-- This script creates the system_settings table for storing system-wide configuration

CREATE TABLE IF NOT EXISTS system_settings (
    id BIGINT NOT NULL AUTO_INCREMENT,
    
    -- Company Information
    company_name VARCHAR(255) DEFAULT 'Employee Management System',
    company_email VARCHAR(255) DEFAULT 'admin@ems.com',
    company_phone VARCHAR(50) DEFAULT '+1 (555) 123-4567',
    company_address TEXT DEFAULT '123 Business Ave, Tech City, TC 12345',
    
    -- Localization Settings
    default_vacation_days INT DEFAULT 20,
    currency VARCHAR(10) DEFAULT 'USD',
    date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
    theme VARCHAR(20) DEFAULT 'light',
    timezone VARCHAR(100) DEFAULT 'America/New_York',
    
    -- Email Notifications
    email_notifications BOOLEAN DEFAULT TRUE,
    new_employee_alerts BOOLEAN DEFAULT TRUE,
    salary_update_alerts BOOLEAN DEFAULT FALSE,
    system_maintenance BOOLEAN DEFAULT TRUE,
    
    -- Backup Settings
    auto_backup BOOLEAN DEFAULT TRUE,
    backup_frequency VARCHAR(20) DEFAULT 'weekly',
    retention_period VARCHAR(10) DEFAULT '30',
    
    -- Security Settings
    password_min_length INT DEFAULT 8,
    require_special_chars BOOLEAN DEFAULT TRUE,
    require_numbers BOOLEAN DEFAULT TRUE,
    require_uppercase BOOLEAN DEFAULT TRUE,
    session_timeout INT DEFAULT 30,
    two_factor_required BOOLEAN DEFAULT FALSE,
    login_attempts INT DEFAULT 5,
    lockout_duration INT DEFAULT 15,
    
    -- Email Configuration
    smtp_host VARCHAR(255) DEFAULT 'smtp.gmail.com',
    smtp_port INT DEFAULT 587,
    smtp_username VARCHAR(255) DEFAULT 'noreply@ems.com',
    smtp_password VARCHAR(255) DEFAULT '••••••••••••',
    from_name VARCHAR(255) DEFAULT 'EMS HR',
    from_email VARCHAR(255) DEFAULT 'hr@ems.com',
    enable_ssl BOOLEAN DEFAULT TRUE,
    
    -- Audit Fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system',
    updated_by VARCHAR(255) DEFAULT 'system',
    
    PRIMARY KEY (id)
);

-- Insert default settings if table is empty
INSERT INTO system_settings (
    company_name, company_email, company_phone, company_address,
    default_vacation_days, currency, date_format, theme, timezone,
    email_notifications, new_employee_alerts, salary_update_alerts, system_maintenance,
    auto_backup, backup_frequency, retention_period,
    password_min_length, require_special_chars, require_numbers, require_uppercase,
    session_timeout, two_factor_required, login_attempts, lockout_duration,
    smtp_host, smtp_port, smtp_username, smtp_password, from_name, from_email, enable_ssl,
    created_by, updated_by
)
SELECT 
    'Employee Management System', 'admin@ems.com', '+1 (555) 123-4567', '123 Business Ave, Tech City, TC 12345',
    20, 'USD', 'MM/DD/YYYY', 'light', 'America/New_York',
    TRUE, TRUE, FALSE, TRUE,
    TRUE, 'weekly', '30',
    8, TRUE, TRUE, TRUE,
    30, FALSE, 5, 15,
    'smtp.gmail.com', 587, 'noreply@ems.com', '••••••••••••', 'EMS HR', 'hr@ems.com', TRUE,
    'system', 'system'
WHERE NOT EXISTS (SELECT 1 FROM system_settings);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_system_settings_updated_at ON system_settings(updated_at DESC);
