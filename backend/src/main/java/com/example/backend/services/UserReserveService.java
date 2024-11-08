package com.example.backend.services;

import com.example.backend.models.UserReserve;
import com.example.backend.repositories.UserReserveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserReserveService {

    private final UserReserveRepository userReserveRepository;

    public List<UserReserve> findAllByDateAndRoomId(LocalDate date, Integer roomId) {
        return userReserveRepository.findAllByDateAndRoomId(date, roomId);
    }

    public List<UserReserve> findAllWeekUserReserve(LocalDate startWeekDate, LocalDate endWeekDate, String userEmail) {
        return userReserveRepository.findAllWeekUserReserve(startWeekDate, endWeekDate, userEmail);
    }

    public void saveOrUpdate(UserReserve userReserve) {
        userReserveRepository.save(userReserve);
    }

    public void deleteUserReserve(LocalDate reserveDate, LocalTime startTime, Integer roomId, String email) {
        userReserveRepository.deleteReserve(reserveDate, startTime, roomId, email);
    }

}
