package com.example.backend.models.dtos;

import com.example.backend.models.FixedReserve;
import com.example.backend.models.User;
import com.example.backend.models.UserReserve;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

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
