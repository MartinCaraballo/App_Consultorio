package com.example.backend.models.requests;

import lombok.Data;

import java.sql.Time;

@Data
public class CreateFixedReserveReq {
    private Integer dayIndex;
    private Time startTime;
    private Time endTime;
    private Integer roomId;
}
