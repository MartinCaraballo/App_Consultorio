package com.example.backend.repositories;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.models.FixedReserve;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixedReserveRepository extends JpaRepository<FixedReserve, FixedReserveKey> {
}
