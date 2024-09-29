package com.example.backend.services;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.models.FixedReserve;
import com.example.backend.repositories.FixedReserveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FixedReserveService {

    private final FixedReserveRepository fixedReserveRepository;

    public List<FixedReserve> findAllByDayIndexAndRoomId(Integer dayIndex, Integer roomId) {
        return fixedReserveRepository.findAllByDayIndexAndRoomId(dayIndex, roomId);
    }

    public void saveOrUpdate(FixedReserve fixedReserve) {
        fixedReserveRepository.save(fixedReserve);
    }

    public void deleteByFixedReserveKey(FixedReserveKey fixedReserveKey) {
        fixedReserveRepository.deleteByFixedReserveKey(fixedReserveKey);
    }

}
