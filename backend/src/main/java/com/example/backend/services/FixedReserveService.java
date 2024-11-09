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

    public List<FixedReserve> findAllByDayIndexAndRoomIdAndAdminEmail(Integer dayIndex, Integer roomId, String adminEmail) {
        return fixedReserveRepository.findAllByDayIndexAndRoomIdAndAdminEmail(dayIndex, roomId, adminEmail);
    }

    public void saveOrUpdate(FixedReserve fixedReserve) {
        fixedReserveRepository.save(fixedReserve);
    }

    public void deleteFixedReserve(FixedReserveKey fixedReserveKey, Integer roomId, String email) {
        fixedReserveRepository.deleteFixedReserve(fixedReserveKey, roomId, email);
    }

    public void deleteAllByAdminEmail(String email) { fixedReserveRepository.deleteAllByAdminEmail(email); }

    public List<ReserveDTO> getReserveDTOS(List<FixedReserve> fixedReserves, User adminUserData) {
        List<ReserveDTO> userFixedReservesDTO = new ArrayList<>(fixedReserves.size());

        for (FixedReserve fixedReserve : fixedReserves) {
            ReserveDTO reserveDTO = new ReserveDTO(
                    adminUserData.getName(),
                    adminUserData.getLastName(),
                    fixedReserve.getRoom().getRoomId(),
                    fixedReserve.getFixedReserveKey().getStartTime(),
                    fixedReserve.getFixedReserveKey().getStartTime().plusHours(1),
                    null,
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
