package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

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
