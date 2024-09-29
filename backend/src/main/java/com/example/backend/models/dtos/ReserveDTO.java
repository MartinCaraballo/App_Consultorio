package com.example.backend.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@AllArgsConstructor
@Data
public class ReserveDTO {
    private String name;
    private String lastName;
    private Integer roomId;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate reserveDate;
    private boolean canCancel;
}
