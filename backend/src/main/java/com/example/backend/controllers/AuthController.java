package com.example.backend.controllers;

import com.example.backend.exceptions.InvalidUserRegistrationException;
import com.example.backend.models.Login;
import com.example.backend.models.RegisterReq;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterReq registerReq) throws InvalidUserRegistrationException {

        // REGISTER USER

        return new ResponseEntity<>(
                String.format("User with email %s has been registered.", registerReq.getEmail()),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> logInUser(@RequestBody Login login) throws AuthenticationException {
        return new ResponseEntity<>("Login successful!", HttpStatus.OK);
    }

}
