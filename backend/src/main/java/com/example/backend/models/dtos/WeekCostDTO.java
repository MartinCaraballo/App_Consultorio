package com.example.backend.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@AllArgsConstructor
@Data
public class WeekCostDTO {
    private List<DayCostDTO> weekDays;
    private Integer totalCost;
    private Integer totalHours;

}
