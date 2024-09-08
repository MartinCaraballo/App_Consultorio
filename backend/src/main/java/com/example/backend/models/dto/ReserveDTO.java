package com.example.backend.models.dto;

import lombok.Data;

import java.time.LocalTime;

@Data
public class ReserveDTO {
    private String name;
    private String lastName;
    private Integer roomId;
    private LocalTime startTime;
    private boolean canCancel;
}
