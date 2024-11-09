package com.example.backend.services;

import com.example.backend.models.User;
import com.example.backend.models.UserReserve;
import com.example.backend.models.dtos.ReserveDTO;
import com.example.backend.repositories.UserReserveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserReserveService {

    private final UserReserveRepository userReserveRepository;

    public List<UserReserve> findAllByDateAndRoomId(LocalDate date, Integer roomId) {
        return userReserveRepository.findAllByDateAndRoomId(date, roomId);
    }

    public List<UserReserve> findAllReserveBetweenDates(LocalDate startWeekDate, LocalDate endWeekDate, String userEmail) {
        return userReserveRepository.findAllReserveBetweenDates(startWeekDate, endWeekDate, userEmail);
    }

    public void saveOrUpdate(UserReserve userReserve) {
        userReserveRepository.save(userReserve);
    }

    public void deleteUserReserve(LocalDate reserveDate, LocalTime startTime, Integer roomId, String email) {
        userReserveRepository.deleteReserve(reserveDate, startTime, roomId, email);
    }

    public void deleteAllByUserEmail(String email) { userReserveRepository.deleteAllByUserEmail(email); }

    public List<ReserveDTO> getReserveDTOS(List<UserReserve> userReserves, User adminUserData) {
        List<ReserveDTO> userFixedReservesDTO = new ArrayList<>(userReserves.size());

        for (UserReserve userReserve : userReserves) {
            LocalTime reserveStartTime = userReserve.getReserveKey().getStartTime();
            ReserveDTO reserveDTO = new ReserveDTO(
                    adminUserData.getName(),
                    adminUserData.getLastName(),
                    userReserve.getRoom().getRoomId(),
                    reserveStartTime,
                    reserveStartTime.plusHours(1),
                    userReserve.getReserveKey().getReserveDate(),
                    userHaveAccess(adminUserData.getEmail())
            );
            userFixedReservesDTO.add(reserveDTO);
        }
        return userFixedReservesDTO;
    }

    private boolean userHaveAccess(String id) {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        return user.equals(id);
    }

}
