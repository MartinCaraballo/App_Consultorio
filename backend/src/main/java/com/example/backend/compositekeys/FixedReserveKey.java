package com.example.backend.compositekeys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalTime;

@Getter
@Setter
@Embeddable
public class FixedReserveKey implements Serializable {
    private Integer dayIndex;
    private LocalTime startTime;
}
