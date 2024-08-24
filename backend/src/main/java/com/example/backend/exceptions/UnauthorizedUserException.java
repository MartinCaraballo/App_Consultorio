package com.example.backend.exceptions;

public class UnauthorizedUserException extends RuntimeException {
    public UnauthorizedUserException(String user) {
        super(String.format("Unauthorized user: %s", user));
    }
}
