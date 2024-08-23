package com.example.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Table;

import java.util.Set;

@Data
@Entity
@Table(name = "Users")
public class User {
    @Id
    private String email;

    @Column(name = "phone_number", unique = true, nullable = false)
    private String phoneNumber;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @OneToMany(mappedBy = "user")
    private Set<UserReserve> reserves;

    @OneToOne(mappedBy = "user")
    private Admin admin;

    @OneToOne(mappedBy = "user")
    @PrimaryKeyJoinColumn
    private Login login;
}
