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

    @Query("SELECT f FROM FixedReserve f WHERE f.fixedReserveKey.dayIndex= :dayIndex AND f.fixedReserveKey.roomId= :roomId AND f.user.email= :userEmail")
    List<FixedReserve> findAllByDayIndexAndRoomIdAndUserEmail(Integer dayIndex, Integer roomId, String userEmail);

    List<FixedReserve> findAllByUserEmail(String userEmail);

    void deleteByFixedReserveKey(FixedReserveKey fixedReserveKey);

    @Modifying
    @Query("DELETE FROM FixedReserve f WHERE f.user.email= :userEmail")
    void deleteAllByUserEmail(String userEmail);
}