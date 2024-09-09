package com.example.backend.compositekeys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.sql.Time;

@Data
@Embeddable
public class FixedReserveKey implements Serializable {
    private Integer dayIndex;
    @Column(insertable = false, updatable=false)
    private String email;
    private Time startTime;
    private Integer roomId;
}
