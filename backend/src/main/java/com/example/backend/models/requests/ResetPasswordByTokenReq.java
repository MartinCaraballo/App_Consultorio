package com.example.backend.models.requests;

public record ResetPasswordByTokenReq(String token, String newPassword) { }
