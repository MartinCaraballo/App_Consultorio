package com.example.backend.services;

import com.example.backend.models.Price;
import com.example.backend.repositories.PriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PriceService {

    private final PriceRepository priceRepository;

    public List<Price> getAllPricesOrderedAscByHours() {
        return priceRepository.findAllByOrderByHoursAsc();
    }

    public void saveOrUpdatePrice(Price price) {
        priceRepository.save(price);
    }

    public void deletePrice(Integer id) { priceRepository.deleteById(id); }

}
