package com.example.backend.repositories;

import com.example.backend.compositekeys.UserReserveKey;
import com.example.backend.models.UserReserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface UserReserveRepository extends JpaRepository<UserReserve, UserReserveKey> {

    @Query("SELECT u FROM UserReserve u WHERE u.reserveKey.reserveDate=:date AND u.room.roomId=:roomId")
    List<UserReserve> findAllByDateAndRoomId(LocalDate date, Integer roomId);

    @Query("SELECT u FROM UserReserve u WHERE u.reserveKey.reserveDate BETWEEN :startWeekDate AND :endWeekDate AND u.user.email = :userEmail")
    List<UserReserve> findAllWeekUserReserve(LocalDate startWeekDate, LocalDate endWeekDate, String userEmail);

    void deleteByReserveKey(UserReserveKey userReserveKey);
}
