package com.example.backend.models.requests;

import lombok.Data;

import java.time.LocalTime;

@Data
public class CreateFixedReserveReq {
    private Integer dayIndex;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer roomId;
}
