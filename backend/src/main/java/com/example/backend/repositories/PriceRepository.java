package com.example.backend.repositories;

import com.example.backend.models.Price;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PriceRepository extends JpaRepository<Price, Integer> {

    List<Price> findAllByOrderByHoursAsc();

    void deleteById(int id);
}
