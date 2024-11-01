package com.example.backend.controllers;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.Login;
import com.example.backend.models.Price;
import com.example.backend.models.UserReserve;
import com.example.backend.models.dtos.DayCostDTO;
import com.example.backend.models.dtos.WeekCostDTO;
import com.example.backend.models.requests.ChangePasswordReq;
import com.example.backend.models.requests.ReportErrorReq;
import com.example.backend.repositories.LoginRepository;
import com.example.backend.services.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final UserReserveService userReserveService;
    private final PriceService priceService;
    private final LoginService loginService;
    private final LoginRepository loginRepository;
    private final SendEmailService sendEmailService;
    private final UserService userService;

    @GetMapping("/week-cost")
    public ResponseEntity<WeekCostDTO> getWeekCostAndHours() {
        String user = getUserByContextToken();

        LocalDate today = LocalDate.now();
        // setting to monday
        LocalDate startWeekDate = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate endWeekDate = startWeekDate.plusDays(5);

        Map<LocalDate, ArrayList<UserReserve>> reservesGroupedByDate = new LinkedHashMap<>();
        LocalDate currentDate = startWeekDate;

        while (!currentDate.isAfter(endWeekDate)) {
            reservesGroupedByDate.put(currentDate, new ArrayList<>());
            currentDate = currentDate.plusDays(1);
        }

        List<UserReserve> userWeekReserves = userReserveService.findAllWeekUserReserve(startWeekDate, endWeekDate, user);

        for (UserReserve userReserve : userWeekReserves) {
            reservesGroupedByDate.get(userReserve.getReserveKey().getReserveDate()).add(userReserve);
        }

        List<Price> prices = priceService.getAllPricesOrderedAscByHours();
        List<DayCostDTO> dayCosts = new ArrayList<>();

        for (Map.Entry<LocalDate, ArrayList<UserReserve>> entry : reservesGroupedByDate.entrySet()) {
            int reservesCount = entry.getValue().size();
            DayCostDTO dayCostDTO = new DayCostDTO(entry.getKey(), reservesCount);
            dayCosts.add(dayCostDTO);
        }

        int totalHours = userWeekReserves.size();
        int actualPriceIndex = 0;
        Price actualPrice = prices.getFirst();

        int totalCost = 0;
        while (totalHours > 0) {
            int aux = totalHours - actualPrice.getHours();
            if (aux > 0) {
                totalHours = aux;
                totalCost += actualPrice.getHours() * actualPrice.getPricePerHour();
                actualPriceIndex++;
                actualPrice = prices.get(actualPriceIndex);
            } else {
                totalCost += totalHours * actualPrice.getPricePerHour();
                totalHours = aux;
            }
        }

        WeekCostDTO weekCost = new WeekCostDTO(dayCosts, totalCost, userWeekReserves.size());
        return new ResponseEntity<>(weekCost, HttpStatus.OK);
    }

    @PostMapping("/change-pass")
    public ResponseEntity<String> changeUserPassword(@RequestBody ChangePasswordReq changePasswordReq) {
        String user = getUserByContextToken();
        Login login = loginService.findById(user).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(changePasswordReq.oldPassword(), login.getPassword())) {
            return new ResponseEntity<>("Old and new password dont match.", HttpStatus.UNAUTHORIZED);
        }

        login.setPassword(passwordEncoder.encode(changePasswordReq.newPassword()));
        loginRepository.save(login);

        return new ResponseEntity<>("User password changed successfully.", HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword() {
        String user = getUserByContextToken();
        String token = UUID.randomUUID().toString();


        return new ResponseEntity<>("Reset token sended to user email successfully.", HttpStatus.OK);
    }

    @PostMapping("/report")
    public ResponseEntity<String> reportError(@RequestBody ReportErrorReq reportErrorReq) {
        String user = getUserByContextToken();
        sendEmailService.sendSimpleMail(reportErrorReq.message(), user);

        return new ResponseEntity<>("Error received successfully.", HttpStatus.OK);
    }

    private String getUserByContextToken() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}
