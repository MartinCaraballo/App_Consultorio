package com.example.backend.controllers;

import com.example.backend.config.TokenProvider;
import com.example.backend.exceptions.InvalidUserRegistrationException;
import com.example.backend.exceptions.UnauthorizedUserException;
import com.example.backend.models.CustomUserDetails;
import com.example.backend.models.Login;
import com.example.backend.models.RegisterReq;
import com.example.backend.models.User;
import com.example.backend.services.LoginService;
import com.example.backend.services.UserService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final TokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private static final String REGEX_EMAIL = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$";
    private final PasswordEncoder passwordEncoder;
    private final LoginService loginService;
    private final UserService userService;

    public AuthController(TokenProvider tokenProvider, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, LoginService loginService, UserService userService) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.loginService = loginService;
        this.userService = userService;
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterReq registerReq) throws InvalidUserRegistrationException {
        if (!isStringValid(registerReq.getEmail())) {
            return new ResponseEntity<>(
                    String.format("Email %s is not a valid mail.", registerReq.getEmail()),
                    HttpStatus.BAD_REQUEST
            );
        }

        Optional<User> existingUserOpt = userService.findById(registerReq.getEmail());
        if (existingUserOpt.isPresent()) {
            return new ResponseEntity<>(
                    String.format("User with email %s already exists.", registerReq.getEmail()),
                    HttpStatus.BAD_REQUEST
            );
        }

        User user = new User();
        user.setEmail(registerReq.getEmail());
        user.setName(registerReq.getName());
        user.setLastName(registerReq.getLastName());
        user.setPhoneNumber(registerReq.getPhoneNumber());

        Login login = new Login();
        login.setUser(user);
        login.setPassword(passwordEncoder.encode(registerReq.getPassword()));
        login.setAuthorized(false);
        login.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));

        loginService.saveOrUpdate(login);

        return new ResponseEntity<>(
                String.format("User with email %s has been registered.", registerReq.getEmail()),
                HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<String> logInUser(@RequestBody CustomUserDetails customUserDetails) throws UnauthorizedUserException {
        Authentication auth = new UsernamePasswordAuthenticationToken(customUserDetails.getEmail(), customUserDetails.getPassword());
        Authentication authUser = authenticationManager.authenticate(auth);
        String accessToken = tokenProvider.generateAccessToken((CustomUserDetails) authUser.getPrincipal());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.set("Authorization", "Bearer " + accessToken);
        return new ResponseEntity<>("Login successful!", httpHeaders, HttpStatus.OK);
    }

    private boolean isStringValid(String email) {
        Pattern pattern = Pattern.compile(REGEX_EMAIL, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }
}
