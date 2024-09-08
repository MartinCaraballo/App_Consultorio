package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/week")
public class WeekDaysController {

    @GetMapping
    public ResponseEntity<List<LocalDate>> getWeekDates() {
        List<LocalDate> weekDates = new ArrayList<>(6);
        LocalDate today = LocalDate.now();
        // setting to monday
        LocalDate current = today.minusDays(today.getDayOfWeek().getValue() - 1);
        for (int i = 0; i < 6; i++) {
            weekDates.add(current);
            current = current.plusDays(1);
        }

        return new ResponseEntity<>(weekDates, HttpStatus.OK);
    }

}
