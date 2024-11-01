package com.example.backend.models.requests;

import lombok.Data;

public record ChangePasswordReq(String oldPassword, String newPassword) {
}
