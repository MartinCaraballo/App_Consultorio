package com.example.backend.tasks;

import com.example.backend.services.PasswordResetTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClearPasswordResetTable {

    private final PasswordResetTokenService passwordResetTokenService;

    @Scheduled(cron = "0 0 0 * * *")
    public void clearPasswordResetTable() {
        passwordResetTokenService.clearTable();
    }

}
