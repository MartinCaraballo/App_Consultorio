package com.example.backend.services;

import com.example.backend.models.UserReserve;
import com.example.backend.repositories.UserReserveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserReserveService {

    private final UserReserveRepository userReserveRepository;

    public List<UserReserve> findAllByDate(LocalDate date) {
        return userReserveRepository.findAllByDate(date);
    }

    public void saveOrUpdate(UserReserve userReserve) {
        userReserveRepository.save(userReserve);
    }

}
