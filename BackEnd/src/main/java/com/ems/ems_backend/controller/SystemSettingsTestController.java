package com.ems.ems_backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.ems.ems_backend.dto.SystemSettingsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.HashMap;

/**
 * Test Controller for System Settings
 * Use this to test the functionality without authentication
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test/settings")
@RequiredArgsConstructor
@Slf4j
public class SystemSettingsTestController {

    /**
     * Simple test endpoint to verify backend is working
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "System Settings Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("endpoints", Map.of(
            "getSettings", "GET /api/settings/system",
            "updateSettings", "PUT /api/settings/system", 
            "resetSettings", "POST /api/settings/system/reset",
            "sendTestEmail", "POST /api/settings/system/send-test-email",
            "createBackup", "POST /api/settings/system/create-backup",
            "clearCache", "POST /api/settings/system/clear-cache",
            "systemInfo", "GET /api/settings/system/info"
        ));
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test data structure for frontend
     */
    @GetMapping("/sample-data")
    public ResponseEntity<Map<String, Object>> getSampleData() {
        Map<String, Object> sampleSettings = new HashMap<>();
        sampleSettings.put("companyName", "Test Company");
        sampleSettings.put("companyEmail", "test@company.com");
        sampleSettings.put("companyPhone", "+1 (555) 123-4567");
        sampleSettings.put("companyAddress", "123 Test St, Test City, TC 12345");
        sampleSettings.put("defaultVacationDays", 20);
        sampleSettings.put("currency", "USD");
        sampleSettings.put("dateFormat", "MM/DD/YYYY");
        sampleSettings.put("timezone", "America/New_York");
        
        // Notifications
        Map<String, Object> notifications = new HashMap<>();
        notifications.put("emailNotifications", true);
        notifications.put("newEmployeeAlerts", true);
        notifications.put("salaryUpdateAlerts", false);
        notifications.put("systemMaintenance", true);
        sampleSettings.put("notifications", notifications);
        
        // Backup
        Map<String, Object> backup = new HashMap<>();
        backup.put("autoBackup", true);
        backup.put("backupFrequency", "weekly");
        backup.put("retentionPeriod", 30);
        sampleSettings.put("backup", backup);
        
        // Security
        Map<String, Object> security = new HashMap<>();
        security.put("passwordMinLength", 8);
        security.put("requireSpecialChars", true);
        security.put("requireNumbers", true);
        security.put("requireUppercase", true);
        security.put("sessionTimeout", 30);
        security.put("twoFactorRequired", false);
        security.put("loginAttempts", 5);
        security.put("lockoutDuration", 15);
        sampleSettings.put("security", security);
        
        // Email
        Map<String, Object> email = new HashMap<>();
        email.put("smtpHost", "smtp.gmail.com");
        email.put("smtpPort", 587);
        email.put("smtpUsername", "noreply@company.com");
        email.put("fromName", "Test HR");
        email.put("fromEmail", "hr@company.com");
        email.put("enableSSL", true);
        sampleSettings.put("email", email);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Sample settings data");
        response.put("data", sampleSettings);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test validation rules
     */
    @GetMapping("/validation-rules")
    public ResponseEntity<Map<String, Object>> getValidationRules() {
        Map<String, Object> validationRules = Map.of(
            "general", Map.of(
                "companyName", "Required, 2-255 characters",
                "companyEmail", "Required, valid email format",
                "defaultVacationDays", "0-365 days"
            ),
            "security", Map.of(
                "passwordMinLength", "6-20 characters",
                "sessionTimeout", "5-120 minutes",
                "loginAttempts", "3-10 attempts", 
                "lockoutDuration", "5-60 minutes"
            ),
            "email", Map.of(
                "smtpPort", "1-65535",
                "fromEmail", "Valid email format required"
            ),
            "backup", Map.of(
                "retentionPeriod", "1-365 days"
            )
        );
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Validation rules retrieved",
            "rules", validationRules
        ));
    }
}
