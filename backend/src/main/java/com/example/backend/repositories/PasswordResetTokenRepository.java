package com.example.backend.repositories;

import com.example.backend.models.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    PasswordResetToken findPasswordResetTokenByToken(String token);

    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiryDateTime <= :actualDateTime")
    void deleteAllByExpiryDateTimeIsAfter(LocalDateTime actualDateTime);
}
