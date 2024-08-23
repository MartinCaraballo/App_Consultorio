package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "Login")
public class Login {
    @Id
    private String email;
    private String password;
    private Boolean authorized;
    private Timestamp lastLogin;

    @OneToOne
    @MapsId
    @JoinColumn(name = "email")
    private User user;
}
