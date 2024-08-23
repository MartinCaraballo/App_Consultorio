package com.example.backend.exceptions;

public class InvalidUserRegistrationException extends RuntimeException {
    public InvalidUserRegistrationException() {
        super("Failed to register user.");
    }
}
