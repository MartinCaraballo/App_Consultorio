package com.example.backend.repositories;

import com.example.backend.compositekeys.UserReserveKey;
import com.example.backend.models.UserReserve;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReserveRepository extends JpaRepository<UserReserve, UserReserveKey> {
}
