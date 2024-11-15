package com.example.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/week")
public class WeekDaysController {

    @GetMapping
    public ResponseEntity<List<LocalDate>> getWeekDates() {
        List<LocalDate> weekDates = new ArrayList<>(12);
        LocalDate today = LocalDate.now(ZoneId.of("America/Montevideo"));
        LocalDate end = today.plusWeeks(1);

        while (!today.isAfter(end)) {
            if (today.getDayOfWeek().getValue() % 7 == 0) {
                today = today.plusDays(1);
            }
            weekDates.add(today);
            today = today.plusDays(1);
        }


        return new ResponseEntity<>(weekDates, HttpStatus.OK);
    }

}
