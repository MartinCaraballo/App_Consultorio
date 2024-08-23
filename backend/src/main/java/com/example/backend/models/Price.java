package com.example.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Prices")
public class Price {
    @Id
    private Integer hours;

    @Column(name = "price_per_hour", nullable = false)
    private Integer pricePerHour;
}
