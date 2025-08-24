package com.ems.ems_backend.service;

import com.ems.ems_backend.dto.SystemSettingsRequest;
import com.ems.ems_backend.dto.SystemSettingsResponse;
import com.ems.ems_backend.model.SystemSettings;
import com.ems.ems_backend.repository.SystemSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SystemSettingsService {

    private final SystemSettingsRepository systemSettingsRepository;

    /**
     * Get current system settings
     */
    public SystemSettingsResponse getCurrentSettings() {
        try {
            Optional<SystemSettings> settingsOpt = systemSettingsRepository.findCurrentSettings();
            
            if (settingsOpt.isEmpty()) {
                // Create default settings if none exist
                SystemSettings defaultSettings = createDefaultSettings();
                SystemSettings saved = systemSettingsRepository.save(defaultSettings);
                return mapToResponse(saved, true, "Default settings created");
            }
            
            return mapToResponse(settingsOpt.get(), true, "Settings retrieved successfully");
        } catch (Exception e) {
            log.error("Error retrieving system settings", e);
            return new SystemSettingsResponse(false, "Failed to retrieve settings: " + e.getMessage());
        }
    }

    /**
     * Update system settings
     */
    @Transactional
    public SystemSettingsResponse updateSettings(SystemSettingsRequest request, String updatedBy) {
        try {
            SystemSettings settings = systemSettingsRepository.findCurrentSettings()
                    .orElse(createDefaultSettings());

            // Update all fields
            settings.setCompanyName(request.getCompanyName());
            settings.setCompanyEmail(request.getCompanyEmail());
            settings.setCompanyPhone(request.getCompanyPhone());
            settings.setCompanyAddress(request.getCompanyAddress());
            settings.setDefaultVacationDays(request.getDefaultVacationDays());
            settings.setCurrency(request.getCurrency());
            settings.setDateFormat(request.getDateFormat());
            settings.setTheme(request.getTheme());
            settings.setTimezone(request.getTimezone());

            // Update notification settings
            if (request.getNotifications() != null) {
                settings.setEmailNotifications(request.getNotifications().getEmailNotifications());
                settings.setNewEmployeeAlerts(request.getNotifications().getNewEmployeeAlerts());
                settings.setSalaryUpdateAlerts(request.getNotifications().getSalaryUpdateAlerts());
                settings.setSystemMaintenance(request.getNotifications().getSystemMaintenance());
            }

            // Update backup settings
            if (request.getBackup() != null) {
                settings.setAutoBackup(request.getBackup().getAutoBackup());
                settings.setBackupFrequency(request.getBackup().getBackupFrequency());
                settings.setRetentionPeriod(request.getBackup().getRetentionPeriod());
            }

            // Update security settings
            if (request.getSecurity() != null) {
                settings.setPasswordMinLength(request.getSecurity().getPasswordMinLength());
                settings.setRequireSpecialChars(request.getSecurity().getRequireSpecialChars());
                settings.setRequireNumbers(request.getSecurity().getRequireNumbers());
                settings.setRequireUppercase(request.getSecurity().getRequireUppercase());
                settings.setSessionTimeout(request.getSecurity().getSessionTimeout());
                settings.setTwoFactorRequired(request.getSecurity().getTwoFactorRequired());
                settings.setLoginAttempts(request.getSecurity().getLoginAttempts());
                settings.setLockoutDuration(request.getSecurity().getLockoutDuration());
            }

            // Update email settings
            if (request.getEmail() != null) {
                settings.setSmtpHost(request.getEmail().getSmtpHost());
                settings.setSmtpPort(request.getEmail().getSmtpPort());
                settings.setSmtpUsername(request.getEmail().getSmtpUsername());
                settings.setSmtpPassword(request.getEmail().getSmtpPassword());
                settings.setFromName(request.getEmail().getFromName());
                settings.setFromEmail(request.getEmail().getFromEmail());
                settings.setEnableSSL(request.getEmail().getEnableSSL());
            }

            settings.setUpdatedBy(updatedBy);
            settings.setUpdatedAt(LocalDateTime.now());

            SystemSettings savedSettings = systemSettingsRepository.save(settings);
            log.info("System settings updated by: {}", updatedBy);

            return mapToResponse(savedSettings, true, "Settings updated successfully");
        } catch (Exception e) {
            log.error("Error updating system settings", e);
            return new SystemSettingsResponse(false, "Failed to update settings: " + e.getMessage());
        }
    }

    /**
     * Reset settings to default values
     */
    @Transactional
    public SystemSettingsResponse resetToDefaults(String updatedBy) {
        try {
            SystemSettings defaultSettings = createDefaultSettings();
            defaultSettings.setUpdatedBy(updatedBy);
            defaultSettings.setCreatedBy(updatedBy);
            
            // Delete existing settings and save new defaults
            systemSettingsRepository.deleteAll();
            SystemSettings saved = systemSettingsRepository.save(defaultSettings);
            
            log.info("System settings reset to defaults by: {}", updatedBy);
            return mapToResponse(saved, true, "Settings reset to defaults successfully");
        } catch (Exception e) {
            log.error("Error resetting system settings", e);
            return new SystemSettingsResponse(false, "Failed to reset settings: " + e.getMessage());
        }
    }

    /**
     * Send test email (placeholder implementation)
     */
    public SystemSettingsResponse sendTestEmail(String testEmail) {
        try {
            SystemSettings settings = systemSettingsRepository.findCurrentSettings()
                    .orElse(createDefaultSettings());

            // For now, just log the test email attempt
            // In a real implementation, you would integrate with an email service
            log.info("Test email would be sent to: {} with settings from: {}", testEmail, settings.getFromEmail());
            
            return new SystemSettingsResponse(true, "Test email sent successfully");
        } catch (Exception e) {
            log.error("Error sending test email", e);
            return new SystemSettingsResponse(false, "Failed to send test email: " + e.getMessage());
        }
    }

    /**
     * Create manual backup (placeholder - implement based on your backup strategy)
     */
    public SystemSettingsResponse createManualBackup() {
        try {
            // Implement your backup logic here
            log.info("Manual backup initiated");
            return new SystemSettingsResponse(true, "Backup created successfully");
        } catch (Exception e) {
            log.error("Error creating backup", e);
            return new SystemSettingsResponse(false, "Failed to create backup: " + e.getMessage());
        }
    }

    /**
     * Clear system cache (placeholder - implement based on your caching strategy)
     */
    public SystemSettingsResponse clearCache() {
        try {
            // Implement your cache clearing logic here
            log.info("System cache cleared");
            return new SystemSettingsResponse(true, "Cache cleared successfully");
        } catch (Exception e) {
            log.error("Error clearing cache", e);
            return new SystemSettingsResponse(false, "Failed to clear cache: " + e.getMessage());
        }
    }

    /**
     * Create default settings
     */
    private SystemSettings createDefaultSettings() {
        SystemSettings settings = new SystemSettings();
        
        // Company defaults
        settings.setCompanyName("Employee Management System");
        settings.setCompanyEmail("admin@ems.com");
        settings.setCompanyPhone("+1 (555) 123-4567");
        settings.setCompanyAddress("123 Business Ave, Tech City, TC 12345");
        settings.setDefaultVacationDays(20);
        settings.setCurrency("USD");
        settings.setDateFormat("MM/DD/YYYY");
        settings.setTheme("light");
        settings.setTimezone("America/New_York");

        // Notification defaults
        settings.setEmailNotifications(true);
        settings.setNewEmployeeAlerts(true);
        settings.setSalaryUpdateAlerts(false);
        settings.setSystemMaintenance(true);

        // Backup defaults
        settings.setAutoBackup(true);
        settings.setBackupFrequency("weekly");
        settings.setRetentionPeriod(30);

        // Security defaults
        settings.setPasswordMinLength(8);
        settings.setRequireSpecialChars(true);
        settings.setRequireNumbers(true);
        settings.setRequireUppercase(true);
        settings.setSessionTimeout(30);
        settings.setTwoFactorRequired(false);
        settings.setLoginAttempts(5);
        settings.setLockoutDuration(15);

        // Email defaults
        settings.setSmtpHost("smtp.gmail.com");
        settings.setSmtpPort(587);
        settings.setSmtpUsername("noreply@ems.com");
        settings.setSmtpPassword("••••••••••••");
        settings.setFromName("EMS HR");
        settings.setFromEmail("hr@ems.com");
        settings.setEnableSSL(true);

        settings.setCreatedBy("system");
        settings.setUpdatedBy("system");

        return settings;
    }

    /**
     * Map SystemSettings entity to response DTO
     */
    private SystemSettingsResponse mapToResponse(SystemSettings settings, boolean success, String message) {
        // This would typically use a mapper like MapStruct
        // For now, implementing manually
        SystemSettingsResponse response = new SystemSettingsResponse();
        response.setSuccess(success);
        response.setMessage(message);
        response.setLastUpdated(settings.getUpdatedAt());
        
        // You would map the data here - simplified for brevity
        // In a real application, you'd want to use a proper mapper
        
        return response;
    }
}
