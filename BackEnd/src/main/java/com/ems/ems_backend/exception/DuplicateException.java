package com.ems.ems_backend.exception;

public class DuplicateException extends RuntimeException {

    public DuplicateException(String message) {
        super(message);
    }

    public DuplicateException(String entityType, String field, String value) {
        super(String.format("%s with %s '%s' already exists", entityType, field, value));
    }

    public DuplicateException(String message, Throwable cause) {
        super(message, cause);
    }
}
