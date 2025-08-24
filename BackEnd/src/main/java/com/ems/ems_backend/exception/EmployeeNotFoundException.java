package com.ems.ems_backend.exception;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(String id) {
        super("Employee not found with id: " + id);
    }
}