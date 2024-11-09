package com.example.backend.services;

import com.example.backend.models.*;
import com.example.backend.repositories.PasswordResetTokenRepository;
import com.example.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PriceService priceService;

    public Optional<User> findById(String email) {
        return userRepository.findById(email);
    }

    public List<User> findAllRegularUsers() { return userRepository.findAllRegularUsers(); }

    public List<User> findNotAuthorized() {
        return userRepository.findNotAuthorizedUsers();
    }

    public void saveOrUpdate(User user) {
        userRepository.save(user);
    }

    public void delete(User user) {
        userRepository.delete(user);
    }

    public void createPasswordResetTokenForUser(PasswordResetToken passwordResetToken) {
        passwordResetTokenRepository.save(passwordResetToken);
    }

    public int getReserveCost(List<UserReserve> userReserveList) {
        List<Price> prices = priceService.getAllPricesOrderedAscByHours();
        int actualPriceIndex = 0;
        Price actualPrice = prices.getFirst();

        int totalHours = userReserveList.size();
        int totalCost = 0;

        while (totalHours > 0) {
            int aux = totalHours - actualPrice.getHours();
            if (aux > 0) {
                totalHours = aux;
                totalCost += actualPrice.getHours() * actualPrice.getPricePerHour();
                actualPriceIndex++;
                actualPrice = prices.get(actualPriceIndex);
            } else {
                totalCost += totalHours * actualPrice.getPricePerHour();
                totalHours = aux;
            }
        }

        return totalCost;
    }
}
