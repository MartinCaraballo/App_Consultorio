package com.example.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Entity
@Data
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    @OneToOne(targetEntity = Login.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "email", referencedColumnName = "email")
    private Login login;

    private LocalDateTime reqDateTime;
    private LocalDateTime expiryDateTime;

    public PasswordResetToken() {
    }

    public PasswordResetToken(Login loginData, LocalDateTime reqDateTime, LocalDateTime expDateTime, String token) {
        this.login = loginData;
        this.reqDateTime = reqDateTime;
        this.expiryDateTime = expDateTime;
        this.token = token;
    }
}
