package com.example.backend.models.dtos;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class UserReserveData {
    private List<ReserveDTO> monthReserves;
    private Integer monthlyCost;
    private Integer totalHours;
}
