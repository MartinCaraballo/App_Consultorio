package com.example.backend.services;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.models.FixedReserve;
import com.example.backend.models.User;
import com.example.backend.models.dtos.ReserveDTO;
import com.example.backend.repositories.FixedReserveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FixedReserveService {

    private final FixedReserveRepository fixedReserveRepository;

    public List<FixedReserve> findAllByDayIndexAndRoomId(Integer dayIndex, Integer roomId) {
        return fixedReserveRepository.findAllByDayIndexAndRoomId(dayIndex, roomId);
    }

    public List<FixedReserve> findAllByDayIndexAndRoomIdAndUserEmail(Integer dayIndex, Integer roomId, String userEmail) {
        return fixedReserveRepository.findAllByDayIndexAndRoomIdAndUserEmail(dayIndex, roomId, userEmail);
    }

    public List<FixedReserve> findAllByUserEmail(String userEmail) {
        return fixedReserveRepository.findAllByUserEmail(userEmail);
    }

    public void saveOrUpdate(FixedReserve fixedReserve) {
        fixedReserveRepository.save(fixedReserve);
    }

    public void deleteFixedReserve(FixedReserveKey fixedReserveKey) {
        fixedReserveRepository.deleteByFixedReserveKey(fixedReserveKey);
    }

    public void deleteAllByUserEmail(String email) {
        fixedReserveRepository.deleteAllByUserEmail(email);
    }

    public List<ReserveDTO> getReserveDTOS(List<FixedReserve> fixedReserves, User userData) {
        List<ReserveDTO> userFixedReservesDTO = new ArrayList<>(fixedReserves.size());

        for (FixedReserve fixedReserve : fixedReserves) {
            ReserveDTO reserveDTO = new ReserveDTO(
                    userData.getName(),
                    userData.getLastName(),
                    fixedReserve.getFixedReserveKey().getRoomId(),
                    fixedReserve.getFixedReserveKey().getStartTime(),
                    fixedReserve.getFixedReserveKey().getStartTime().plusHours(1),
                    null,
                    userHaveAccess(userData.getEmail())
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
