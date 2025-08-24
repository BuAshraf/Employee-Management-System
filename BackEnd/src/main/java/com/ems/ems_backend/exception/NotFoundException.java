package com.ems.ems_backend.exception;

public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String entityType, Long id) {
        super(String.format("%s with id %d not found", entityType, id));
    }

    public NotFoundException(String entityType, String identifier) {
        super(String.format("%s with identifier '%s' not found", entityType, identifier));
    }

    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
