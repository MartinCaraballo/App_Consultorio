package com.example.backend.repositories;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.models.FixedReserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FixedReserveRepository extends JpaRepository<FixedReserve, FixedReserveKey> {

    @Query("SELECT f FROM FixedReserve f WHERE f.fixedReserveKey.dayIndex= :dayIndex")
    public List<FixedReserve> findAllByDayIndex(Integer dayIndex);
}
