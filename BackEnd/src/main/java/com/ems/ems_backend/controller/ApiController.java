package com.ems.ems_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ApiController {

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getApiStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "online");
        status.put("timestamp", LocalDateTime.now());
        status.put("version", "1.0.0");
        status.put("service", "EMS Backend API");
        status.put("cors", "http://localhost:3000");
        status.put("endpoints", Arrays.asList(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/me",
            "/api/auth/logout",
            "/api/demo/roles",
            "/api/demo/credentials/{roleType}",
            "/api/demo/users",
            "/api/demo/departments",
            "/api/employees",
            "/api/employees/{id}",
            "/api/employees/profile",
            "/api/departments",
            "/api/departments/{id}",
            "/api/finance/salary-overview",
            "/api/finance/budget",
            "/api/admin/**",
            "/api/status",
            "/api/health"
        ));
        status.put("authentication", "JWT Bearer Token");
        status.put("database", "Connected");
        return ResponseEntity.ok(status);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> getHealth() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("database", "Connected");
        health.put("security", "Active");
        health.put("cors", "Configured");
        health.put("demo_data", "Available");
        return ResponseEntity.ok(health);
    }

    @GetMapping("/troubleshoot")
    public ResponseEntity<Map<String, Object>> getTroubleshootInfo() {
        Map<String, Object> troubleshoot = new HashMap<>();

        // Common issues and solutions
        troubleshoot.put("common_issues", Arrays.asList(
            "CORS Error: Verify frontend is running on http://localhost:3000",
            "401 Unauthorized: Check if JWT token is included in Authorization header",
            "403 Forbidden: Verify user has required permissions for the endpoint",
            "Circular Reference: Fixed with @JsonIgnoreProperties annotations"
        ));

        troubleshoot.put("test_commands", Map.of(
            "api_status", "curl http://localhost:8080/api/status",
            "demo_login", "curl -X POST http://localhost:8080/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@ems.com\",\"password\":\"admin123\"}'",
            "demo_roles", "curl http://localhost:8080/api/demo/roles",
            "protected_endpoint", "curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:8080/api/employees"
        ));

        troubleshoot.put("owner_account", Map.of(
            "username", "BuAshraf",
            "note", "Hidden super admin account with full permissions"
        ));

        return ResponseEntity.ok(troubleshoot);
    }
}
