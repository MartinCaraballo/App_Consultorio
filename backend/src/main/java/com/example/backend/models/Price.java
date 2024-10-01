package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Prices")
public class Price {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "price_sequence")
    @SequenceGenerator(name = "price_sequence", sequenceName = "price_sequence", allocationSize = 1)
    private Integer id;

    @Column(name = "hours", nullable = false)
    private Integer hours;

    @Column(name = "price_per_hour", nullable = false)
    private Integer pricePerHour;
}
