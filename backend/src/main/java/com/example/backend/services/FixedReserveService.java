package com.example.backend.services;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.models.FixedReserve;
import com.example.backend.repositories.FixedReserveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FixedReserveService {

    private final FixedReserveRepository fixedReserveRepository;

    public Optional<FixedReserve> findById(FixedReserveKey fixedReserveKey) {
        return fixedReserveRepository.findById(fixedReserveKey);
    }

    public List<FixedReserve> findAllByDayIndex(Integer dayIndex) {
        return fixedReserveRepository.findAllByDayIndex(dayIndex);
    }

    public void saveOrUpdate(FixedReserve fixedReserve) {
        fixedReserveRepository.save(fixedReserve);
    }

    public void delete(FixedReserve fixedReserve) {
        fixedReserveRepository.delete(fixedReserve);
    }

}
