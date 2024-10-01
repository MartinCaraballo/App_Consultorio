package com.example.backend.models.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class UserDTO {
    private String email;
    private String name;
    private String lastName;
    private String phoneNumber;
    private LocalDateTime lastLogin;
    private Boolean isAdmin;
}
