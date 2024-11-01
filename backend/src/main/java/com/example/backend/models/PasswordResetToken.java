package com.example.backend.models;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class PasswordResetToken {

    private static final int EXPIRATION_TIME = 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "token_sequence")
    private Long id;

    private String token;

    @OneToOne(targetEntity = Login.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "email", referencedColumnName = "email")
    private Login login;

    private LocalDate expiryDate;
}
