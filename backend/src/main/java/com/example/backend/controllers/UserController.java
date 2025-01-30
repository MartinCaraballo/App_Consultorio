package com.example.backend.controllers;

import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.*;
import com.example.backend.models.dtos.DayCostDTO;
import com.example.backend.models.dtos.WeekCostDTO;
import com.example.backend.models.requests.ChangePasswordReq;
import com.example.backend.models.requests.ReportErrorReq;
import com.example.backend.models.requests.ResetPasswordByTokenReq;
import com.example.backend.models.requests.ResetPasswordReq;
import com.example.backend.repositories.LoginRepository;
import com.example.backend.repositories.PasswordResetTokenRepository;
import com.example.backend.services.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final PasswordResetTokenService passwordResetTokenService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    @Value("${cors.origin.dns}")
    String recoverPasswordURL;

    private final PasswordEncoder passwordEncoder;
    private final UserReserveService userReserveService;
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

        List<UserReserve> userWeekReserves = userReserveService.findAllReserveBetweenDates(startWeekDate, endWeekDate, user);

        for (UserReserve userReserve : userWeekReserves) {
            reservesGroupedByDate.get(userReserve.getReserveKey().getReserveDate()).add(userReserve);
        }

        List<DayCostDTO> dayCosts = new ArrayList<>();

        for (Map.Entry<LocalDate, ArrayList<UserReserve>> entry : reservesGroupedByDate.entrySet()) {
            int reservesCount = entry.getValue().size();
            DayCostDTO dayCostDTO = new DayCostDTO(entry.getKey(), reservesCount);
            dayCosts.add(dayCostDTO);
        }

        WeekCostDTO weekCost = new WeekCostDTO(
                dayCosts, userService.getReserveCost(userWeekReserves), userWeekReserves.size()
        );
        return new ResponseEntity<>(weekCost, HttpStatus.OK);
    }

    @GetMapping("/can-make-fixed-reserves")
    public ResponseEntity<Boolean> getUserCanMakeFixedReserves() {
        String userEmail = getUserByContextToken();

        User user = userService.findById(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new ResponseEntity<>(user.isCanMakeFixedReserve(), HttpStatus.OK);
    }

    @GetMapping("/monthly-cost")
    public ResponseEntity<Integer> getMonthlyCost() {
        String userMail = getUserByContextToken();

        LocalDate today = LocalDate.now();
        LocalDate monthStart = LocalDate.of(today.getYear(), today.getMonth(), 1);
        LocalDate monthEnd = today.plusMonths(1);

        return new ResponseEntity<>(
                userService.getReserveCost(
                        userReserveService.findAllReserveBetweenDates(monthStart, monthEnd, userMail)
                ),
                HttpStatus.OK
        );
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
    public ResponseEntity<String> resetPassword(HttpServletRequest request, @RequestBody ResetPasswordReq resetPasswordReq) {
        Login loginData = loginService.findById(resetPasswordReq.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = UUID.randomUUID().toString();

        LocalDateTime reqDateTime = LocalDateTime.now();
        LocalDateTime expDateTime = LocalDateTime.now().plusDays(1);

        PasswordResetToken passwordResetToken = new PasswordResetToken(loginData, reqDateTime, expDateTime, token);
        userService.createPasswordResetTokenForUser(passwordResetToken);

        String recoverPasswordFullUrl = recoverPasswordURL + "/forgot-password?token=" + token;

        sendEmailService.sendRecoverPasswordEmail(resetPasswordReq.email(), passwordResetToken, recoverPasswordFullUrl);

        return new ResponseEntity<>("Reset token sended to user email successfully.", HttpStatus.OK);
    }

    @PostMapping("/reset-password-token")
    public ResponseEntity<String> resetPasswordByToken(@RequestBody ResetPasswordByTokenReq resetPasswordByTokenReq) {
        PasswordResetToken passwordResetToken = passwordResetTokenService.findEmailByToken(resetPasswordByTokenReq.token());
        Login targetUser = passwordResetToken.getLogin();

        targetUser.setPassword(passwordEncoder.encode(resetPasswordByTokenReq.newPassword()));
        loginRepository.save(targetUser);

        passwordResetTokenService.delete(passwordResetToken);

        return new ResponseEntity<>("Password reseted successfully.", HttpStatus.OK);
    }

    @PostMapping("/report")
    public ResponseEntity<String> reportError(@RequestBody ReportErrorReq reportErrorReq) {
        String user = getUserByContextToken();
        sendEmailService.sendErrorReportMail(reportErrorReq.message(), user);

        return new ResponseEntity<>("Error received successfully.", HttpStatus.OK);
    }

    private String getUserByContextToken() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}
