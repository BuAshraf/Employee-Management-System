package com.ems.ems_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class DemoCredentialsHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(BadCredentialsException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("error", "Invalid Credentials");
        body.put("message", "Invalid username or password");
        body.put("demoCredentials", getDemoCredentials());
        body.put("suggestion", "Try using one of the demo accounts provided above");

        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("error", "Authentication Failed");
        body.put("message", ex.getMessage());
        body.put("demoCredentials", getDemoCredentials());

        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    private Map<String, Object> getDemoCredentials() {
        Map<String, Object> demoAccounts = new LinkedHashMap<>();

        // Admin Demo Account
        Map<String, String> admin = new LinkedHashMap<>();
        admin.put("email", "admin@ems.com");
        admin.put("password", "admin123");
        admin.put("role", "ADMIN");
        admin.put("description", "Full system access for administrators");

        // HR Demo Account
        Map<String, String> hr = new LinkedHashMap<>();
        hr.put("email", "hr@ems.com");
        hr.put("password", "hr123");
        hr.put("role", "HR");
        hr.put("description", "Human Resources access for employee management");

        // Manager Demo Account
        Map<String, String> manager = new LinkedHashMap<>();
        manager.put("email", "manager@ems.com");
        manager.put("password", "manager123");
        manager.put("role", "MANAGER");
        manager.put("description", "Department manager access");

        // Employee Demo Account
        Map<String, String> employee = new LinkedHashMap<>();
        employee.put("email", "employee@ems.com");
        employee.put("password", "employee123");
        employee.put("role", "EMPLOYEE");
        employee.put("description", "Regular employee access");

        demoAccounts.put("admin", admin);
        demoAccounts.put("hr", hr);
        demoAccounts.put("manager", manager);
        demoAccounts.put("employee", employee);

        return demoAccounts;
    }
}
