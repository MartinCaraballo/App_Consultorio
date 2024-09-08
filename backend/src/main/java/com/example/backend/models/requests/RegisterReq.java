package com.example.backend.models.requests;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class RegisterReq {
    private String email;
    private String password;
    private String phoneNumber;
    private String name;
    private String lastName;
}
