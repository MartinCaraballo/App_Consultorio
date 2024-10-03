package com.example.backend.controllers;

import com.example.backend.models.Price;
import com.example.backend.models.UserReserve;
import com.example.backend.models.dtos.DayCostDTO;
import com.example.backend.models.dtos.WeekCostDTO;
import com.example.backend.services.PriceService;
import com.example.backend.services.UserReserveService;
import com.example.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserReserveService userReserveService;
    private final PriceService priceService;

    @GetMapping("/week-cost")
    public ResponseEntity<WeekCostDTO> getWeekCostAndHours() {
        String user = getUserByContextToken();

        LocalDate today = LocalDate.now();
        // setting to monday
        LocalDate startWeekDate = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate endWeekDate = startWeekDate.plusDays(5);

        Map<LocalDate, ArrayList<UserReserve>> reservesGroupedByDate = new LinkedHashMap<>();
        LocalDate currentDate = startWeekDate;

        while (!currentDate.isAfter(endWeekDate)) {
            reservesGroupedByDate.put(currentDate, new ArrayList<>());
            currentDate = currentDate.plusDays(1);
        }

        List<UserReserve> userWeekReserves = userReserveService.findAllWeekUserReserve(startWeekDate, endWeekDate, user);

        for (UserReserve userReserve : userWeekReserves) {
            reservesGroupedByDate.get(userReserve.getReserveKey().getReserveDate()).add(userReserve);
        }

        List<Price> prices = priceService.getAllPricesOrderedAscByHours();
        List<DayCostDTO> dayCosts = new ArrayList<>();

        for (Map.Entry<LocalDate, ArrayList<UserReserve>> entry : reservesGroupedByDate.entrySet()) {
            int reservesCount = entry.getValue().size();
            DayCostDTO dayCostDTO = new DayCostDTO(entry.getKey(), reservesCount);
            dayCosts.add(dayCostDTO);
        }

        int totalHours = userWeekReserves.size();
        int actualPriceIndex = 0;
        Price actualPrice = prices.getFirst();

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

        WeekCostDTO weekCost = new WeekCostDTO(dayCosts, totalCost, userWeekReserves.size());
        return new ResponseEntity<>(weekCost, HttpStatus.OK);
    }

    private String getUserByContextToken() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

}
