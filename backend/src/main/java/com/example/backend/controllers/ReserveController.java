package com.example.backend.controllers;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.compositekeys.UserReserveKey;
import com.example.backend.models.FixedReserve;
import com.example.backend.models.Room;
import com.example.backend.models.User;
import com.example.backend.models.UserReserve;
import com.example.backend.models.dtos.ReserveDTO;
import com.example.backend.models.requests.CreateFixedReserveReq;
import com.example.backend.models.requests.CreateUserReserveReq;
import com.example.backend.services.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reserve")
public class ReserveController {

    private final FixedReserveService fixedReserveService;
    private final UserReserveService userReserveService;
    private final RoomService roomService;
    private final UserService userService;
    private final AdminService adminService;

    @Transactional
    @PostMapping
    public ResponseEntity<String> postUserReserve(@RequestBody List<CreateUserReserveReq> listReserveReq) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        LocalDateTime nowDateTime =  LocalDateTime.now();

        for (CreateUserReserveReq createReserveReq : listReserveReq) {

            if (createReserveReq.getReserveDate().isBefore(nowDateTime.toLocalDate()))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

            if (createReserveReq.getStartTime().isBefore(nowDateTime.toLocalTime()))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

            Optional<User> user = userService.findById(userEmail);
            Optional<Room> room = roomService.findRoomById(createReserveReq.getRoomId());
            if (user.isEmpty() || room.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            UserReserveKey reserveKey = new UserReserveKey();
            reserveKey.setEmail(userEmail);
            reserveKey.setStartTime(createReserveReq.getStartTime());
            reserveKey.setRoomId(createReserveReq.getRoomId());
            UserReserve userReserve = new UserReserve();
            userReserve.setReserveKey(reserveKey);
            userReserve.setReserveDate(createReserveReq.getReserveDate());
            userReserve.setRoom(room.get());
            userReserve.setUser(user.get());

            userReserveService.saveOrUpdate(userReserve);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // TODO: Endpoint only for admins
    @Transactional
    @PostMapping("/fixed")
    public ResponseEntity<String> postFixedReserve(@RequestBody CreateFixedReserveReq createReserveReq) {
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAllUserReservesOfDay(@RequestParam Integer roomId,
                                                                    @RequestParam Integer dayIndex,
                                                                    @RequestParam LocalDate date) {
        List<FixedReserve> fixedReserves = fixedReserveService.findAllByDayIndexAndRoomId(dayIndex, roomId);
        List<UserReserve> userReserves = userReserveService.findAllByDateAndRoomId(date, roomId);
        Map<LocalTime, ReserveDTO> existingReserves = new HashMap<>();

        for (FixedReserve fixedReserve : fixedReserves) {
            User user = fixedReserve.getAdmin().getUser();
            FixedReserveKey fixedReserveKey = fixedReserve.getFixedReserveKey();
            Integer reserveRoomId = fixedReserveKey.getRoomId();
            LocalTime startTime = fixedReserveKey.getStartTime().toLocalTime();
            boolean canCancel = userHaveAccess(user.getEmail());
            ReserveDTO reserveDTO = new ReserveDTO(
                    user.getName(),
                    user.getLastName(),
                    reserveRoomId,
                    startTime,
                    null,
                    canCancel
            );
            existingReserves.put(startTime, reserveDTO);
        }

        for (UserReserve userReserve : userReserves) {
            User user = userReserve.getUser();
            UserReserveKey reserveKey = userReserve.getReserveKey();
            Integer reserveRoomId = reserveKey.getRoomId();
            LocalTime startTime = reserveKey.getStartTime();
            boolean canCancel = userHaveAccess(user.getEmail());
            ReserveDTO reserveDTO = new ReserveDTO(
                    user.getName(),
                    user.getLastName(),
                    reserveRoomId,
                    startTime,
                    userReserve.getReserveDate(),
                    canCancel
            );
            existingReserves.put(startTime, reserveDTO);
        }

        List<ReserveDTO> dayReserves = new ArrayList<>(17);
        LocalTime reserveTime = LocalTime.of(7, 0, 0);
        while (reserveTime.getHour() != 23) {
            if (existingReserves.get(reserveTime) != null) {
                dayReserves.add(existingReserves.get(reserveTime));
            } else {
                ReserveDTO reserveDTO = new ReserveDTO(
                        null,
                        null,
                        roomId,
                        reserveTime,
                        date,
                        false
                );
                dayReserves.add(reserveDTO);
            }
            reserveTime = reserveTime.plusHours(1);
        }

        return new ResponseEntity<>(dayReserves, HttpStatus.OK);
    }

    private boolean userHaveAccess(String id) {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        return user.equals(id);
    }
}
