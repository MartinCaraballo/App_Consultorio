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

    void deleteByReserveKey(UserReserveKey userReserveKey);
}
