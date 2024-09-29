package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Prices")
public class Price {
    @Id
    @GeneratedValue
    private Integer id;

    @Column(name = "hours", nullable = false)
    private Integer hours;

    @Column(name = "price_per_hour", nullable = false)
    private Integer pricePerHour;
}
