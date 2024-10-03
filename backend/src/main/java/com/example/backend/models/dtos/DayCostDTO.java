package com.example.backend.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@AllArgsConstructor
@Data
public class DayCostDTO {
    private LocalDate date;
    private Integer hoursCount;
}
