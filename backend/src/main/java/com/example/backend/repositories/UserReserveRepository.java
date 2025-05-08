package com.example.backend.repositories;

import com.example.backend.compositekeys.UserReserveKey;
import com.example.backend.models.UserReserve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface UserReserveRepository extends JpaRepository<UserReserve, UserReserveKey> {

    @Query("SELECT u FROM UserReserve u WHERE u.reserveKey.reserveDate= :reserveDate AND u.reserveKey.startTime= :startTime AND u.room.roomId= :roomId AND u.user.email= :email")
    Optional<UserReserve> findUserReserveByReserveKeyAndEmail(LocalDate reserveDate, LocalTime startTime, Integer roomId, String email);

    @Query("SELECT u FROM UserReserve u WHERE u.reserveKey.reserveDate >= :date AND NOT u.isMonthly")
    List<UserReserve> findAllUserReservesAfterGivenDate(LocalDate date);

    @Query("SELECT u FROM UserReserve u WHERE u.reserveKey.reserveDate >= :date AND u.isMonthly AND u.user.email= :userEmail")
    List<UserReserve> findAllMonthlyUserReservesAfterGivenDate(LocalDate date, String userEmail);


    @Query("SELECT u FROM UserReserve u WHERE u.reserveKey.reserveDate= :date AND u.room.roomId= :roomId")
    List<UserReserve> findAllByDateAndRoomId(LocalDate date, Integer roomId);

    @Query("SELECT u FROM UserReserve u WHERE u.reserveKey.reserveDate BETWEEN :startWeekDate AND :endWeekDate AND u.user.email= :userEmail")
    List<UserReserve> findAllReserveBetweenDates(LocalDate startWeekDate, LocalDate endWeekDate, String userEmail);

    @Modifying
    @Query("DELETE FROM UserReserve u WHERE u.reserveKey.reserveDate= :reserveDate AND u.reserveKey.startTime= :startTime AND u.room.roomId= :roomId AND u.user.email= :email")
    void deleteReserve(LocalDate reserveDate, LocalTime startTime, Integer roomId, String email);

    @Modifying
    @Query("DELETE FROM UserReserve u WHERE u.user.email= :userEmail")
    void deleteAllByUserEmail(String userEmail);

    @Modifying
    @Query("DELETE FROM UserReserve u WHERE u.reserveKey.reserveDate <= :refDate")
    void deleteAllReservesPastRefDate(LocalDate refDate);
}
