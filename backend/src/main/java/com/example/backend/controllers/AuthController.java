package com.example.backend.controllers;

import com.example.backend.config.TokenProvider;
import com.example.backend.exceptions.InvalidUserRegistrationException;
import com.example.backend.models.Login;
import com.example.backend.models.RegisterReq;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthController(TokenProvider tokenProvider, AuthenticationManager authenticationManager) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterReq registerReq) throws InvalidUserRegistrationException {

        // REGISTER USER

        return new ResponseEntity<>(
                String.format("User with email %s has been registered.", registerReq.getEmail()),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> logInUser(@RequestBody Login login) throws AuthenticationException {
        Authentication auth = new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword());
        Authentication authUser = authenticationManager.authenticate(auth);
        String accessToken = tokenProvider.generateAccessToken((Login) authUser.getPrincipal());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Authorization", "Bearer " + accessToken);
        return new ResponseEntity<>("Login successful!", httpHeaders, HttpStatus.OK);
    }

}
