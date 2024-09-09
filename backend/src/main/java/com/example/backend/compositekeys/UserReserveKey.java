package com.example.backend.compositekeys;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalTime;

@Data
@Embeddable
public class UserReserveKey implements Serializable {

    private String email;

    private Integer roomId;

    private LocalTime startTime;
}
