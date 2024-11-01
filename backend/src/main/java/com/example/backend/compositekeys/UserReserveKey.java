package com.example.backend.compositekeys;

import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Embeddable
public class UserReserveKey implements Serializable {

    private Integer roomId;

    private LocalTime startTime;

    private LocalDate reserveDate;
}
