package com.example.backend.controllers;

import com.example.backend.services.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<Integer>> getAllRooms() {
        List<Integer> roomList = roomService.findAllRoomIds();

        if (roomList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(roomList);
    }

}
