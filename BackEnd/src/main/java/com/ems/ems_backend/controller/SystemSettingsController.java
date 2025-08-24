package com.ems.ems_backend.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.dto.SystemSettingsRequest;
import com.ems.ems_backend.dto.SystemSettingsResponse;
import com.ems.ems_backend.service.SystemSettingsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@Slf4j
public class SystemSettingsController {

    private final SystemSettingsService systemSettingsService;

    /**
     * Get current system settings
     */
    @GetMapping("/system")
    public ResponseEntity<SystemSettingsResponse> getSystemSettings() {
        try {
            SystemSettingsResponse response = systemSettingsService.getCurrentSettings();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving system settings", e);
            return ResponseEntity.internalServerError()
                    .body(new SystemSettingsResponse(false, "Failed to retrieve settings"));
        }
    }

    /**
     * Update system settings
     */
    @PutMapping("/system")
    public ResponseEntity<SystemSettingsResponse> updateSystemSettings(
            @RequestBody SystemSettingsRequest request,
            Principal principal) {
        try {
            String updatedBy = principal != null ? principal.getName() : "unknown";
            SystemSettingsResponse response = systemSettingsService.updateSettings(request, updatedBy);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error updating system settings", e);
            return ResponseEntity.internalServerError()
                    .body(new SystemSettingsResponse(false, "Failed to update settings"));
        }
    }

    /**
     * Reset settings to defaults
     */
    @PostMapping("/system/reset")
    public ResponseEntity<SystemSettingsResponse> resetSettings(Principal principal) {
        try {
            String updatedBy = principal != null ? principal.getName() : "unknown";
            SystemSettingsResponse response = systemSettingsService.resetToDefaults(updatedBy);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error resetting system settings", e);
            return ResponseEntity.internalServerError()
                    .body(new SystemSettingsResponse(false, "Failed to reset settings"));
        }
    }

    /**
     * Send test email
     */
    @PostMapping("/system/send-test-email")
    public ResponseEntity<SystemSettingsResponse> sendTestEmail(
            @RequestBody Map<String, String> request) {
        try {
            String testEmail = request.get("testEmail");
            if (testEmail == null || testEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new SystemSettingsResponse(false, "Test email address is required"));
            }

            SystemSettingsResponse response = systemSettingsService.sendTestEmail(testEmail);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error sending test email", e);
            return ResponseEntity.internalServerError()
                    .body(new SystemSettingsResponse(false, "Failed to send test email"));
        }
    }

    /**
     * Create manual backup
     */
    @PostMapping("/system/backup")
    public ResponseEntity<SystemSettingsResponse> createManualBackup() {
        try {
            SystemSettingsResponse response = systemSettingsService.createManualBackup();
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error creating manual backup", e);
            return ResponseEntity.internalServerError()
                    .body(new SystemSettingsResponse(false, "Failed to create backup"));
        }
    }

    /**
     * Clear system cache
     */
    @PostMapping("/system/clear-cache")
    public ResponseEntity<SystemSettingsResponse> clearCache() {
        try {
            SystemSettingsResponse response = systemSettingsService.clearCache();
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error clearing cache", e);
            return ResponseEntity.internalServerError()
                    .body(new SystemSettingsResponse(false, "Failed to clear cache"));
        }
    }

    /**
     * Get system information (for the info panel)
     */
    @GetMapping("/system/info")
    public ResponseEntity<Map<String, Object>> getSystemInfo() {
        try {
            // This would typically come from various system monitoring services
            Map<String, Object> systemInfo = Map.of(
                    "version", "v2.1.0",
                    "database", "MySQL 8.0",
                    "lastBackup", "2 hours ago",
                    "uptime", "15 days, 4 hours",
                    "storageUsed", "2.4 GB / 10 GB",
                    "activeUsers", "24"
            );
            
            return ResponseEntity.ok(systemInfo);
        } catch (Exception e) {
            log.error("Error retrieving system info", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
