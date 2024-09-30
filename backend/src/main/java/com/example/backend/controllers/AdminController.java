package com.example.backend.controllers;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.Login;
import com.example.backend.models.Price;
import com.example.backend.models.User;
import com.example.backend.services.LoginService;
import com.example.backend.services.PriceService;
import com.example.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final PriceService priceService;
    private final LoginService loginService;

    @GetMapping("/unauthorized-users")
    public ResponseEntity<List<User>> getUnauthorizedUsers() {
        List<User> unauthorizedUsers = userService.findNotAuthorized();

        if (unauthorizedUsers.isEmpty()) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(unauthorizedUsers, HttpStatus.OK);
    }

    @PutMapping("accept-user/{id}")
    public ResponseEntity<String> acceptUser(@PathVariable String id) {
        Login userLogin = loginService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User with email %s not found", id)));

        userLogin.setAuthorized(true);
        loginService.saveOrUpdate(userLogin);

        return new ResponseEntity<>(
                String.format("User with email %s authorized successfully.", id),
                HttpStatus.OK);
    }

    @PutMapping("reject-user/{id}")
    public ResponseEntity<String> rejectUser(@PathVariable String id) {
        Login userLogin = loginService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User with email %s not found", id)));

        loginService.delete(userLogin);
        userService.delete(userLogin.getUser());

        return new ResponseEntity<>(
                String.format("User with email %s removed successfully", id),
                HttpStatus.OK
        );
    }

    @GetMapping("/all-users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        // Never will be null (at least one user do a successful login).
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/prices")
    public ResponseEntity<List<Price>> getAllPrices() {
        List<Price> prices = priceService.getAllPricesOrderedAscByHours();

        if (prices.isEmpty()) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(prices, HttpStatus.OK);
    }
}
