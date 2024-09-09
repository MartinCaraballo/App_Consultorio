package com.example.backend.models.requests;

import lombok.Data;

import java.sql.Time;

@Data
public class CreateFixedReserveReq {
    private Integer dayIndex;
    private String email;
    private Time startTime;
    private Integer roomId;
}
