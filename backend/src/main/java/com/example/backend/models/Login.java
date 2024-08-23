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
public class Login implements UserDetails {
    @Id
    private String email;
    private String password;
    private Boolean authorized;
    private Timestamp lastLogin;
    private Boolean isAdmin;

    @OneToOne
    @MapsId
    @JoinColumn(name = "email")
    private User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (isAdmin) {
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_ADMIN");
            return Collections.singletonList(authority);
        }
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_USER");
        return Collections.singletonList(authority);
    }

    @Override
    public String getUsername() {
        return email;
    }
}
