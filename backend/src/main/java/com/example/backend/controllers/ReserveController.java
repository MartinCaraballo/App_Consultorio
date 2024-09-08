package com.example.backend.controllers;

import com.example.backend.models.FixedReserve;
import com.example.backend.models.UserReserve;
import com.example.backend.models.dto.ReserveDTO;
import com.example.backend.models.requests.FindReserveReq;
import com.example.backend.services.FixedReserveService;
import com.example.backend.services.UserReserveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reserve")
public class ReserveController {

    private final FixedReserveService fixedReserveService;
    private final UserReserveService userReserveService;

    public ReserveController(FixedReserveService fixedReserveService, UserReserveService userReserveService) {
        this.fixedReserveService = fixedReserveService;
        this.userReserveService = userReserveService;
    }

    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAllUserReservesOfDay(@RequestBody FindReserveReq findReserveReq) {
        List<FixedReserve> fixedReserves = fixedReserveService.findAllByDayIndexAndRoomId(findReserveReq.getDayIndex(), findReserveReq.getRoomId());
        List<UserReserve> userReserves = userReserveService.findAllByDate(findReserveReq.getDate());


        List<ReserveDTO> dayReserves = new ArrayList<>(16);
        LocalTime reserveTime = LocalTime.of(7, 0, 0);
        int i = 0;
        while (reserveTime.getHour() != 23) {
            ReserveDTO object = createReserveDTOObject(String.valueOf(i), String.valueOf(i*2), findReserveReq.getRoomId(), reserveTime, false);
            dayReserves.add(object);
            i++;
            reserveTime = reserveTime.plusHours(1);
        }

        return new ResponseEntity<>(dayReserves, HttpStatus.OK);
    }

    private ReserveDTO createReserveDTOObject(String name, String lastName, Integer roomId, LocalTime startTime, Boolean canCancel) {
        ReserveDTO reserveDTO = new ReserveDTO();
        reserveDTO.setName(name);
        reserveDTO.setLastName(lastName);
        reserveDTO.setRoomId(roomId);
        reserveDTO.setStartTime(startTime);
        reserveDTO.setCanCancel(canCancel);

        return reserveDTO;
    }
}
