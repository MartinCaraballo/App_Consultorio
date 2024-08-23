package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "Admins")
public class Admin {
    @Id
    @OneToOne
    @JoinColumn(name = "email", referencedColumnName = "email")
    private User user;

    @OneToMany(mappedBy="admin")
    private Set<FixedReserve> fixedReserves;

}
