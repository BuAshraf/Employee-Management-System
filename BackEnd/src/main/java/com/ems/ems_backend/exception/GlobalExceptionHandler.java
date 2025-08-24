package com.ems.ems_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleAny(Exception ex) {
        ex.printStackTrace();
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        body.put("error", ex.getClass().getSimpleName());
        body.put("message", ex.getMessage());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

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

    @ExceptionHandler(DuplicateEmployeeException.class)
    public ResponseEntity<Map<String,Object>> onDuplicateEmployee(DuplicateEmployeeException ex) {
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Duplicate Employee");
        body.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<Map<String,Object>> onDuplicate(DuplicateException ex) {
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Duplicate Resource");
        body.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String,Object>> onNotFound(NotFoundException ex) {
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Resource Not Found");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<Map<String,Object>> onEmployeeNotFound(EmployeeNotFoundException ex) {
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.NOT_FOUND.value());
        body.put("error", "Employee Not Found");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> onValidationError(MethodArgumentNotValidException ex) {
        Map<String,Object> body = new LinkedHashMap<>();
        Map<String,String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Validation Failed");
        body.put("message", "Input validation failed");
        body.put("validationErrors", errors);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,Object>> onIllegalArgument(IllegalArgumentException ex) {
        Map<String,Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Invalid Argument");
        body.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(body);
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

        // Department Head Demo Account
        Map<String, String> deptHead = new LinkedHashMap<>();
        deptHead.put("email", "depthead@ems.com");
        deptHead.put("password", "depthead123");
        deptHead.put("role", "DEPARTMENT_HEAD");
        deptHead.put("description", "Can manage specific department");

        // Finance Manager Demo Account
        Map<String, String> financeManager = new LinkedHashMap<>();
        financeManager.put("email", "finance@ems.com");
        financeManager.put("password", "finance123");
        financeManager.put("role", "FINANCE_MANAGER");
        financeManager.put("description", "Access to salary/budget data");

        // IT Support Demo Account
        Map<String, String> itSupport = new LinkedHashMap<>();
        itSupport.put("email", "itsupport@ems.com");
        itSupport.put("password", "itsupport123");
        itSupport.put("role", "IT_SUPPORT");
        itSupport.put("description", "System maintenance access");

        demoAccounts.put("admin", admin);
        demoAccounts.put("hr", hr);
        demoAccounts.put("manager", manager);
        demoAccounts.put("employee", employee);
        demoAccounts.put("departmentHead", deptHead);
        demoAccounts.put("financeManager", financeManager);
        demoAccounts.put("itSupport", itSupport);

        return demoAccounts;
    }
}