package com.example.backend.controllers;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.*;
import com.example.backend.models.dtos.ReserveDTO;
import com.example.backend.services.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final PriceService priceService;
    private final LoginService loginService;
    private final AdminService adminService;
    private final UserReserveService userReserveService;
    private final FixedReserveService fixedReserveService;

    @Transactional
    @PostMapping
    public ResponseEntity<String> makeUserAdmin(@RequestBody Admin admin) {
        User user = userService.findById(admin.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Admin newAdmin = new Admin();
        newAdmin.setUser(user);
        adminService.saveOrUpdate(newAdmin);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeAdmin(@PathVariable String id) {
        Admin admin = adminService.findById(id).orElseThrow();
        fixedReserveService.deleteAllByAdminEmail(admin.getEmail());
        adminService.delete(admin);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> removeUser(@PathVariable String id) {
        Login login = loginService.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Login not found")
        );
        User user = login.getUser();
        userReserveService.deleteAllByUserEmail(login.getEmail());
        loginService.delete(login);
        userService.delete(user);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/unauthorized-users")
    public ResponseEntity<List<User>> getUnauthorizedUsers() {
        List<User> unauthorizedUsers = userService.findNotAuthorized();

        if (unauthorizedUsers.isEmpty()) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(unauthorizedUsers, HttpStatus.OK);
    }

    @PutMapping("/accept-user/{id}")
    public ResponseEntity<String> acceptUser(@PathVariable String id) {
        Login userLogin = loginService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User with email %s not found", id)));

        userLogin.setAuthorized(true);
        loginService.saveOrUpdate(userLogin);

        return new ResponseEntity<>(
                String.format("User with email %s authorized successfully.", id),
                HttpStatus.OK);
    }

    @PutMapping("/reject-user/{id}")
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

    @GetMapping("/admin-users")
    public ResponseEntity<List<User>> getAllAdminUsers() {
        List<User> adminUsers = adminService.findAllAdminUsers();

        return new ResponseEntity<>(adminUsers, HttpStatus.OK);
    }

    @GetMapping("/regular-users")
    public ResponseEntity<List<User>> getAllRegularUsers() {
        List<User> regularUsers = userService.findAllRegularUsers();

        return new ResponseEntity<>(regularUsers, HttpStatus.OK);
    }

    @GetMapping("/prices")
    public ResponseEntity<List<Price>> getAllPrices() {
        List<Price> prices = priceService.getAllPricesOrderedAscByHours();

        if (prices.isEmpty()) return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);

        return new ResponseEntity<>(prices, HttpStatus.OK);
    }

    @GetMapping("/get-user-reserves/{id}")
    public ResponseEntity<List<ReserveDTO>> getUserReserves(@PathVariable String id,
                                                                   @RequestParam LocalDate startDate,
                                                                   @RequestParam LocalDate endDate) {
        User user = userService.findById(id).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User with email %s not found", id))
        );
        List<UserReserve> userReserveList = userReserveService.findAllReserveBetweenDates(startDate, endDate, id);

        List<ReserveDTO> userReserveDTO = userReserveService.getReserveDTOS(userReserveList, user);

        return new ResponseEntity<>(userReserveDTO, HttpStatus.OK);
    }

    @GetMapping("/get-user-monthly-cost/{id}")
    public ResponseEntity<Integer> getUserMonthlyCost(@PathVariable String id,
                                                      @RequestParam LocalDate startDate,
                                                      @RequestParam LocalDate endDate) {
        User user = userService.findById(id).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User with email %s not found", id))
        );
        List<UserReserve> userReserveList = userReserveService.findAllReserveBetweenDates(
                startDate, endDate, user.getEmail()
        );

        int userMonthCost = userService.getReserveCost(userReserveList);

        return new ResponseEntity<>(userMonthCost, HttpStatus.OK);
    }

    @GetMapping("/get-user-data/{id}")
    public ResponseEntity<User> getUserData(@PathVariable String id) {
        User user = userService.findById(id).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User with email %s not found", id))
        );

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @Transactional
    @PostMapping("/prices")
    public ResponseEntity<String> addPrice(@RequestBody Price price) {
        priceService.saveOrUpdatePrice(price);

        return new ResponseEntity<>("Price added successfully", HttpStatus.CREATED);
    }

    @Transactional
    @PutMapping("/prices")
    public ResponseEntity<String> updatePrice(@RequestBody Price price) {
        priceService.saveOrUpdatePrice(price);

        return new ResponseEntity<>("Price updated successfully", HttpStatus.OK);
    }

    @DeleteMapping("/prices/{id}")
    public ResponseEntity<String> deletePrice(@PathVariable Integer id) {
        priceService.deletePrice(id);
        return new ResponseEntity<>("Price deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/change-user-can-make-fixed-reserves/{id}")
    public ResponseEntity<String> changeUserCanMakeFixedReserves(@PathVariable String id,
                                                                 @RequestParam Boolean newValue) {
        User user = userService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setCanMakeFixedReserve(newValue);
        userService.saveOrUpdate(user);

        return new ResponseEntity<>(
                String.format("User can make fix reserve set to %b", newValue),
                HttpStatus.OK);
    }

}
