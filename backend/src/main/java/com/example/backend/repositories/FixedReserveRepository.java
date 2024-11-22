package com.example.backend.repositories;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.models.FixedReserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FixedReserveRepository extends JpaRepository<FixedReserve, FixedReserveKey> {

    @Query("SELECT f FROM FixedReserve f WHERE f.fixedReserveKey.dayIndex= :dayIndex AND f.fixedReserveKey.roomId= :roomId")
    List<FixedReserve> findAllByDayIndexAndRoomId(Integer dayIndex, Integer roomId);

    @Query("SELECT f FROM FixedReserve f WHERE f.fixedReserveKey.dayIndex= :dayIndex AND f.fixedReserveKey.roomId= :roomId AND f.admin.email= :adminEmail")
    List<FixedReserve> findAllByDayIndexAndRoomIdAndAdminEmail(Integer dayIndex, Integer roomId, String adminEmail);

    void deleteByFixedReserveKey(FixedReserveKey fixedReserveKey);

    @Modifying
    @Query("DELETE FROM FixedReserve f WHERE f.admin.email= :adminEmail")
    void deleteAllByAdminEmail(String adminEmail);
}