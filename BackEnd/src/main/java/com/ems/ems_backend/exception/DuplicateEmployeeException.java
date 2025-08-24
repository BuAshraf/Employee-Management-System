// src/main/java/com/ems/ems_backend/exception/DuplicateEmployeeException.java
package com.ems.ems_backend.exception;

public class DuplicateEmployeeException extends DuplicateException {

    public DuplicateEmployeeException(String message) {
        super(message);
    }

    public DuplicateEmployeeException(String field, String value) {
        super("Employee", field, value);
    }

    public DuplicateEmployeeException(String message, Throwable cause) {
        super(message, cause);
    }
}
