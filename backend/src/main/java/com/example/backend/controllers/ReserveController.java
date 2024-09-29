package com.example.backend.controllers;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.compositekeys.UserReserveKey;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.exceptions.UnauthorizedUserException;
import com.example.backend.models.*;
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

            // If the reserve date is before than today
            if (createReserveReq.getReserveDate().isBefore(nowDateTime.toLocalDate()))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

            // If the reserve date is today, but the time is before than actual
            if (createReserveReq.getReserveDate().isEqual(nowDateTime.toLocalDate()) &&
                    createReserveReq.getStartTime().isBefore(nowDateTime.toLocalTime()))
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

            // If the reserve date is more than one week after than today.
            if (createReserveReq.getReserveDate().isAfter(nowDateTime.toLocalDate().plusWeeks(1)))
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

            // If the reserve date is more than one week after than today (including hour).
            if (createReserveReq.getReserveDate().isEqual(nowDateTime.toLocalDate().plusWeeks(1)) &&
                    createReserveReq.getStartTime().isAfter(nowDateTime.toLocalTime()))
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);


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
        String user = getUserByContextToken();
        LocalTime startTime = createFixedReserveReq.getStartTime();
        LocalTime endTime = createFixedReserveReq.getEndTime();

        Room room = roomService.findRoomById(createFixedReserveReq.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        Admin admin = adminService.findById(user).
                orElseThrow(() -> new UnauthorizedUserException("User not authorized"));

        while (startTime.isBefore(endTime)) {
            FixedReserveKey fixedReserveKey = new FixedReserveKey();
            fixedReserveKey.setEmail(user);
            fixedReserveKey.setRoomId(createFixedReserveReq.getRoomId());
            fixedReserveKey.setStartTime(startTime);
            fixedReserveKey.setDayIndex(createFixedReserveReq.getDayIndex());

            FixedReserve fixedReserve = new FixedReserve();
            fixedReserve.setFixedReserveKey(fixedReserveKey);
            fixedReserve.setRoom(room);
            fixedReserve.setAdmin(admin);

            fixedReserveService.saveOrUpdate(fixedReserve);
            startTime = startTime.plusHours(1);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Transactional
    @DeleteMapping
    public ResponseEntity<String> cancelReserve(@RequestParam Integer roomId,
                                                @RequestParam LocalTime startTime,
                                                @RequestParam LocalDate date) {
        LocalDate lastDayToCancel = date.minusDays(1);

        if (!LocalDate.now().isBefore(lastDayToCancel)) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        String user = getUserByContextToken();
        UserReserveKey reserveKey = new UserReserveKey();
        reserveKey.setRoomId(roomId);
        reserveKey.setReserveDate(date);
        reserveKey.setEmail(user);
        reserveKey.setStartTime(startTime);

        userReserveService.deleteByUserReserveKey(reserveKey);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    // TODO: ENDPOINT ONLY FOR ADMINS.
    @Transactional
    @DeleteMapping("/fixed")
    public ResponseEntity<String> cancelFixedReserve(@RequestParam Integer roomId,
                                                     @RequestParam Integer dayIndex,
                                                     @RequestParam LocalTime startTime) {

        String user = getUserByContextToken();
        FixedReserveKey fixedReserveKey = new FixedReserveKey();
        fixedReserveKey.setEmail(user);
        fixedReserveKey.setRoomId(roomId);
        fixedReserveKey.setDayIndex(dayIndex);
        fixedReserveKey.setStartTime(startTime);

        fixedReserveService.deleteByFixedReserveKey(fixedReserveKey);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<ReserveDTO>> getAllUsersReservesOfDay(@RequestParam Integer roomId,
                                                                     @RequestParam Integer dayIndex,
                                                                     @RequestParam LocalDate date) {
        List<FixedReserve> fixedReserves = fixedReserveService.findAllByDayIndexAndRoomId(dayIndex - 1, roomId);
        List<UserReserve> userReserves = userReserveService.findAllByDateAndRoomId(date, roomId);
        Map<LocalTime, ReserveDTO> existingReserves = new HashMap<>();

        for (FixedReserve fixedReserve : fixedReserves) {
            User user = fixedReserve.getAdmin().getUser();
            FixedReserveKey fixedReserveKey = fixedReserve.getFixedReserveKey();
            Integer reserveRoomId = fixedReserveKey.getRoomId();
            LocalTime startTime = fixedReserveKey.getStartTime();
            LocalTime endTime = fixedReserveKey.getStartTime().plusHours(1);
            ReserveDTO reserveDTO = new ReserveDTO(
                    user.getName(),
                    user.getLastName(),
                    reserveRoomId,
                    startTime,
                    endTime,
                    null,
                    false
            );
            existingReserves.put(startTime, reserveDTO);
        }

        for (UserReserve userReserve : userReserves) {
            User user = userReserve.getUser();
            UserReserveKey reserveKey = userReserve.getReserveKey();
            Integer reserveRoomId = reserveKey.getRoomId();
            LocalTime startTime = reserveKey.getStartTime();
            LocalTime endTime = reserveKey.getStartTime().plusHours(1);
            LocalDate reserveDate = reserveKey.getReserveDate();
            boolean canCancel = userHaveAccess(user.getEmail());
            ReserveDTO reserveDTO = new ReserveDTO(
                    user.getName(),
                    user.getLastName(),
                    reserveRoomId,
                    startTime,
                    endTime,
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
                        reserveTime.plusHours(1),
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
        List<FixedReserve> fixedReserves = fixedReserveService.findAllByDayIndexAndRoomId(dayIndex, roomId);

        List<ReserveDTO> userFixedReservesDTO = new ArrayList<>(fixedReserves.size());

        for (FixedReserve fixedReserve : fixedReserves) {
            ReserveDTO reserveDTO = new ReserveDTO(
                    adminUserData.getName(),
                    adminUserData.getLastName(),
                    fixedReserve.getRoom().getRoomId(),
                    fixedReserve.getFixedReserveKey().getStartTime(),
                    fixedReserve.getFixedReserveKey().getStartTime().plusHours(1),
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
