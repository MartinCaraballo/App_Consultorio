package com.example.backend.tasks;

import com.example.backend.services.UserReserveService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class ClearUserReservesTable {

    private final UserReserveService userReserveService;

    @Scheduled(cron = "0 0 0 1 * *")
    public void clearUserReserveTablePastThreeMonths() {
        userReserveService.deleteAllReservesPastRefDate(LocalDate.now().minusMonths(3));
    }

}
