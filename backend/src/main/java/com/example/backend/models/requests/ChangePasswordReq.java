package com.example.backend.models.requests;

public record ChangePasswordReq(String oldPassword, String newPassword) { }
