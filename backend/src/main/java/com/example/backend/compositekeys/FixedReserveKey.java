package com.example.backend.compositekeys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalTime;

@Data
@Embeddable
public class FixedReserveKey implements Serializable {
    private Integer dayIndex;
    private String email;
    private LocalTime startTime;
    private Integer roomId;
}
