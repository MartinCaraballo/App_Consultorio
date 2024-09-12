package com.example.backend.controllers;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.compositekeys.UserReserveKey;
import com.example.backend.models.*;
import com.example.backend.models.dtos.ReserveDTO;
import com.example.backend.models.requests.CreateFixedReserveReq;
import com.example.backend.models.requests.CreateUserReserveReq;
import com.example.backend.services.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        String userEmail = getUserByContextToken();
        LocalDateTime nowDateTime = LocalDateTime.now();

        for (CreateUserReserveReq createReserveReq : listReserveReq) {

            if (createReserveReq.getReserveDate().isBefore(nowDateTime.toLocalDate()))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

            if (createReserveReq.getReserveDate().isEqual(nowDateTime.toLocalDate()) &&
                    createReserveReq.getStartTime().isBefore(nowDateTime.toLocalTime()))
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
            reserveKey.setReserveDate(createReserveReq.getReserveDate());

            UserReserve userReserve = new UserReserve();
            userReserve.setReserveKey(reserveKey);
            userReserve.setRoom(room.get());
            userReserve.setUser(user.get());

            userReserveService.saveOrUpdate(userReserve);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // TODO: Endpoint only for admins
    @Transactional
    @PostMapping("/fixed")
    public ResponseEntity<String> postFixedReserve(@RequestBody CreateFixedReserveReq createFixedReserveReq) {

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<String> cancelReserve(@RequestParam Integer roomId,
                                                @RequestParam Integer dayIndex,
                                                @RequestParam LocalDate date) {

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // TODO: ENDPOINT ONLY FOR ADMINS.
    @DeleteMapping("/fixed")
    public ResponseEntity<String> cancelFixedReserve(@RequestParam Integer roomId,
                                                     @RequestParam Integer dayIndex,
                                                     @RequestParam LocalTime startTime) {

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAllUsersReservesOfDay(@RequestParam Integer roomId,
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
            LocalDate reserveDate = reserveKey.getReserveDate();
            boolean canCancel = userHaveAccess(user.getEmail());
            ReserveDTO reserveDTO = new ReserveDTO(
                    user.getName(),
                    user.getLastName(),
                    reserveRoomId,
                    startTime,
                    reserveDate,
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

    @GetMapping("/active")
    public ResponseEntity<String> getUserReserves() {
        LocalDate nowDateTime = LocalDate.now();
        String user = SecurityContextHolder.getContext().getAuthentication().getName();

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // TODO: ENDPOINT ONLY FOR ADMINS.
    @GetMapping("/fixed")
    public ResponseEntity<List<ReserveDTO>> getFixedReserves(@RequestParam Integer roomId,
                                                             @RequestParam Integer dayIndex) {
        String user = getUserByContextToken();
        Admin admin = adminService.findById(user).orElse(null);

        if (admin == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User adminUserData = admin.getUser();
        Set<FixedReserve> userFixedReserves = admin.getFixedReserves();
        List<ReserveDTO> userFixedReservesDTO = new ArrayList<>(userFixedReserves.size());

        for (FixedReserve fixedReserve : userFixedReserves) {
            ReserveDTO reserveDTO = new ReserveDTO(
                    adminUserData.getName(),
                    adminUserData.getLastName(),
                    fixedReserve.getRoom().getRoomId(),
                    fixedReserve.getFixedReserveKey().getStartTime().toLocalTime(),
                    null,
                    true
            );
            userFixedReservesDTO.add(reserveDTO);
        }


        return new ResponseEntity<>(userFixedReservesDTO, HttpStatus.OK);
    }


    private boolean userHaveAccess(String id) {
        String user = getUserByContextToken();
        return user.equals(id);
    }

    private String getUserByContextToken() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
