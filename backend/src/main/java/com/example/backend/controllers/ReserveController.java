package com.example.backend.controllers;

import com.example.backend.models.FixedReserve;
import com.example.backend.models.UserReserve;
import com.example.backend.services.FixedReserveService;
import com.example.backend.services.UserReserveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Calendar;
import java.util.List;

@RestController
@RequestMapping("/reserve")
public class ReserveController {

    private final FixedReserveService fixedReserveService;
    private final UserReserveService userReserveService;

    public ReserveController(FixedReserveService fixedReserveService, UserReserveService userReserveService) {
        this.fixedReserveService = fixedReserveService;
        this.userReserveService = userReserveService;
    }

    @GetMapping
    public ResponseEntity<List<UserReserveService>> getAllUserReservesOfDay(Date date) {
        LocalDate localDate = date.toLocalDate();
        List<UserReserve> userReserveList = userReserveService.findAllByDate(date);
        List<FixedReserve> adminFixedReserveList = fixedReserveService.findAllByDayIndex(localDate.getDayOfWeek().getValue());
        return null;
    }
}
