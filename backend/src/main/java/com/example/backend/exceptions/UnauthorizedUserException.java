package com.example.backend.exceptions;

import org.apache.tomcat.websocket.AuthenticationException;

public class UnauthorizedUserException extends RuntimeException {
    public UnauthorizedUserException(String message) {
        super(message);
    }
}
