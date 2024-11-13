package com.example.backend.services;

import com.example.backend.models.PasswordResetToken;
import com.example.backend.repositories.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {

    private final PasswordResetTokenRepository passwordResetTokenRepository;

    public PasswordResetToken findEmailByToken(String token) {
        return passwordResetTokenRepository.findPasswordResetTokenByToken(token);
    }

    public void delete(PasswordResetToken passwordResetToken) {
        passwordResetTokenRepository.delete(passwordResetToken);
    }

    public void clearTable() {
        passwordResetTokenRepository.deleteAllByExpiryDateTimeIsAfter(LocalDateTime.now());
    }

}
