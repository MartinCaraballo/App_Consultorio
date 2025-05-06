package com.example.backend.models.requests;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateMonthlyReserveReq {
    private Integer roomId;
    private LocalTime startTime;
    private Integer monthIndex;
    private LocalDate reserveDate;
}
