package com.example.backend.controllers;

import com.example.backend.compositekeys.FixedReserveKey;
import com.example.backend.compositekeys.UserReserveKey;
import com.example.backend.exceptions.ResourceNotFoundException;
import com.example.backend.models.*;
import com.example.backend.models.dtos.ReserveDTO;
import com.example.backend.models.requests.CreateFixedReserveReq;
import com.example.backend.models.requests.CreateMonthlyReserveReq;
import com.example.backend.models.requests.CreateUserReserveReq;
import com.example.backend.services.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reserve")
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
        User user = userService.findById(userEmail).orElseThrow(
                () -> new NullPointerException("User not found")
        );

        LocalDateTime nowDateTime = LocalDateTime.now(ZoneId.of("America/Montevideo"));

        for (CreateUserReserveReq createReserveReq : listReserveReq) {
            Room room = roomService.findRoomById(createReserveReq.getRoomId()).orElseThrow(
                    () -> new NullPointerException("Room not found")
            );

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

            createReserve(user, createReserveReq.getReserveDate(), createReserveReq.getStartTime(), room, false);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/monthly")
    public ResponseEntity<List<String>> postMonthlyUserReserve(@RequestBody List<CreateMonthlyReserveReq> createMonthlyReserveReqs) {
        String userEmail = getUserByContextToken();
        User user = userService.findById(userEmail).orElseThrow(
                () -> new ResourceNotFoundException("User not found")
        );

        LocalDateTime nowDateTime = LocalDateTime.now(ZoneId.of("America/Montevideo"));
        int todayDayIndex = nowDateTime.getDayOfWeek().getValue() - 1;
        LocalDate weekMonday = nowDateTime.toLocalDate().minusDays(todayDayIndex);

        List<String> failedReserves = new ArrayList<>();

        for (CreateMonthlyReserveReq reserve : createMonthlyReserveReqs) {
            LocalDate nextDate = weekMonday.plusDays(reserve.getDayIndex());
            Room room = roomService.findRoomById(reserve.getRoomId()).orElseThrow(
                    () -> new ResourceNotFoundException("Room not found")
            );

            if (nextDate.isBefore(nowDateTime.toLocalDate())) {
                nextDate = nextDate.plusWeeks(1);
            }

            while (nextDate.getMonthValue() <= reserve.getMonthIndex()) {

                if (nextDate.getMonthValue() == reserve.getMonthIndex()) {
                    try {
                        createReserve(user, nextDate, reserve.getStartTime(), room, true);
                    } catch (DataIntegrityViolationException ignored) {
                        failedReserves.add(String.format("%s-%s", nextDate, reserve.getStartTime()));
                    }
                }
                nextDate = nextDate.plusWeeks(1);
            }
        }

        return new ResponseEntity<>(failedReserves, HttpStatus.CREATED);
    }

    @Transactional
    @PostMapping("/fixed")
    public ResponseEntity<List<String>> postFixedReserve(@RequestBody CreateFixedReserveReq createFixedReserveReq) {
        String userId = getUserByContextToken();

        int startHour = createFixedReserveReq.getStartTime().getHour();
        int endHour = createFixedReserveReq.getEndTime().getHour();

        if (startHour < 7) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        LocalTime startTime = LocalTime.of(startHour, 0);
        LocalTime endTime = LocalTime.of(endHour, 0);

        Room room = roomService.findRoomById(createFixedReserveReq.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Optional<Admin> admin = adminService.findById(userId);

        if (admin.isEmpty() && !user.isCanMakeFixedReserve()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        LocalDate today = LocalDate.now();
        List<UserReserve> allUserReservesAfterToday = userReserveService.findAllUserReservesAfterGivenDate(today);
        Map<LocalTime, UserReserve> userReservesInSelectedDayIndex = new HashMap<>();

        for (UserReserve userReserve : allUserReservesAfterToday) {
            LocalDate reserveDate = userReserve.getReserveKey().getReserveDate();
            int reserveDayIndex = reserveDate.getDayOfWeek().getValue() - 1;

            if (reserveDayIndex == createFixedReserveReq.getDayIndex()) {
                LocalTime reserveDateTime = userReserve.getReserveKey().getStartTime();
                userReservesInSelectedDayIndex.put(reserveDateTime, userReserve);
            }
        }

        List<String> conflictingReserves = new ArrayList<>();
        while (startTime.isBefore(endTime)) {
            try {
                if (userReservesInSelectedDayIndex.get(startTime) != null)
                    conflictingReserves.add(startTime.toString());

                FixedReserveKey fixedReserveKey = new FixedReserveKey();
                fixedReserveKey.setStartTime(startTime);
                fixedReserveKey.setDayIndex(createFixedReserveReq.getDayIndex());
                fixedReserveKey.setRoomId(createFixedReserveReq.getRoomId());

                FixedReserve fixedReserve = new FixedReserve();
                fixedReserve.setFixedReserveKey(fixedReserveKey);
                fixedReserve.setUser(user);
                fixedReserve.setRoom(room);

                fixedReserveService.saveOrUpdate(fixedReserve);
                startTime = startTime.plusHours(1);
            } catch (DataIntegrityViolationException ignored) {
            }
        }

        return new ResponseEntity<>(conflictingReserves, HttpStatus.CREATED);
    }

    @Transactional
    @DeleteMapping
    public ResponseEntity<String> cancelReserve(@RequestParam Integer roomId,
                                                @RequestParam LocalTime startTime,
                                                @RequestParam LocalDate date) {
        LocalDate lastDayToCancel = date.minusDays(1);
        LocalDateTime now = LocalDateTime.now(ZoneId.of("America/Montevideo"));

        String user = getUserByContextToken();

        UserReserve userReserve = userReserveService.findUserReserveByReserveKeyAndEmail(date, startTime, roomId, user)
                .orElseThrow(() -> new ResourceNotFoundException("No se encuentra una reserva con esos datos"));

        if (userReserve.getIsMonthly()) {
            LocalDateTime startLimitToCancel = now.minusHours(1);
            if (userReserve.getDateTimeReserved().isBefore(startLimitToCancel) || userReserve.getDateTimeReserved().isAfter(now))
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        } else {
            if (!now.toLocalDate().isBefore(lastDayToCancel)) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        }

        userReserveService.deleteUserReserve(userReserve);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping("/fixed")
    public ResponseEntity<String> cancelFixedReserve(@RequestParam Integer roomId,
                                                     @RequestParam Integer dayIndex,
                                                     @RequestParam LocalTime startTime) {
        String userId = getUserByContextToken();

        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Optional<Admin> admin = adminService.findById(userId);

        if (admin.isEmpty() && !user.isCanMakeFixedReserve()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        FixedReserveKey fixedReserveKey = new FixedReserveKey();
        fixedReserveKey.setDayIndex(dayIndex);
        fixedReserveKey.setStartTime(startTime);
        fixedReserveKey.setRoomId(roomId);

        fixedReserveService.deleteFixedReserve(fixedReserveKey);

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
            User user = fixedReserve.getUser();
            FixedReserveKey fixedReserveKey = fixedReserve.getFixedReserveKey();
            Integer reserveRoomId = fixedReserve.getRoom().getRoomId();
            LocalTime startTime = fixedReserveKey.getStartTime();
            LocalTime endTime = fixedReserveKey.getStartTime().plusHours(1);
            ReserveDTO reserveDTO = new ReserveDTO(
                    user.getName(),
                    user.getLastName(),
                    reserveRoomId,
                    startTime,
                    endTime,
                    null,
                    fixedReserveKey.getDayIndex(),
                    false,
                    false
            );
            existingReserves.put(startTime, reserveDTO);
        }

        for (UserReserve userReserve : userReserves) {
            User user = userReserve.getUser();
            UserReserveKey reserveKey = userReserve.getReserveKey();
            Integer reserveRoomId = userReserve.getRoom().getRoomId();
            LocalTime startTime = reserveKey.getStartTime();
            LocalTime endTime = reserveKey.getStartTime().plusHours(1);
            LocalDate reserveDate = reserveKey.getReserveDate();
            boolean canCancel = userHaveAccess(user.getEmail(), userReserve.getIsMonthly());
            ReserveDTO reserveDTO = new ReserveDTO(
                    user.getName(),
                    user.getLastName(),
                    reserveRoomId,
                    startTime,
                    endTime,
                    reserveDate,
                    reserveDate.getDayOfWeek().getValue() - 1,
                    canCancel,
                    userReserve.getIsMonthly()
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
                        date.getDayOfWeek().getValue() - 1,
                        false,
                        false
                );
                dayReserves.add(reserveDTO);
            }
            reserveTime = reserveTime.plusHours(1);
        }

        return new ResponseEntity<>(dayReserves, HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<ReserveDTO>> getWeekUserReserves() {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        User userData = userService.findById(user).orElseThrow(
                () -> new ResourceNotFoundException("User not found")
        );

        LocalDate today = LocalDate.now();
        // setting to monday
        LocalDate startWeekDate = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate endWeekDate = today.plusWeeks(1).minusDays(1);
        List<UserReserve> userWeekReserves = userReserveService.findAllReserveBetweenDates(startWeekDate, endWeekDate, user);
        List<ReserveDTO> result = userReserveService.getReserveDTOS(userWeekReserves, userData);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<ReserveDTO>> getMonthUserReserves() {
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        User userData = userService.findById(user).orElseThrow(
                () -> new NullPointerException("User not found")
        );

        LocalDate today = LocalDate.now();
        List<UserReserve> userMonthReserves = userReserveService.findAllMonthlyUserReservesAfterGivenDate(today, user);
        List<ReserveDTO> result = userReserveService.getReserveDTOS(userMonthReserves, userData);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/fixed")
    public ResponseEntity<List<ReserveDTO>> getFixedReserves(@RequestParam Integer roomId,
                                                             @RequestParam Integer dayIndex) {
        String userEmail = getUserByContextToken();

        User user = userService.findById(userEmail)
                .orElseThrow(() -> new NullPointerException("User not found"));

        Optional<Admin> admin = adminService.findById(userEmail);

        if (admin.isEmpty() && !user.isCanMakeFixedReserve()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<FixedReserve> fixedReserves = fixedReserveService.findAllByDayIndexAndRoomIdAndUserEmail(
                dayIndex, roomId, user.getEmail()
        );

        List<ReserveDTO> userFixedReservesDTO = fixedReserveService.getReserveDTOS(fixedReserves, user);

        return new ResponseEntity<>(userFixedReservesDTO, HttpStatus.OK);
    }

    private String getUserByContextToken() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private boolean userHaveAccess(String id, Boolean isMonthlyReserve) {
        if (isMonthlyReserve) {
            return false;
        }
        String user = SecurityContextHolder.getContext().getAuthentication().getName();
        return user.equals(id);
    }

    private void createReserve(User user, LocalDate reserveDate, LocalTime startTime, Room room, Boolean isMonthly) {
        UserReserveKey reserveKey = new UserReserveKey();
        reserveKey.setStartTime(startTime);
        reserveKey.setReserveDate(reserveDate);

        UserReserve userReserve = new UserReserve();
        userReserve.setReserveKey(reserveKey);
        userReserve.setRoom(room);
        userReserve.setUser(user);
        userReserve.setIsMonthly(isMonthly);
        userReserve.setDateTimeReserved(LocalDateTime.now(ZoneId.of("America/Montevideo")));

        userReserveService.saveOrUpdate(userReserve);
    }
}
