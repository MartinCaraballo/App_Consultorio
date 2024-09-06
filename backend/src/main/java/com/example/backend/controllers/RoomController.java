package com.example.backend.controllers;

import com.example.backend.models.Room;
import com.example.backend.services.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/room")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> roomList = roomService.getAllRooms();

        if (roomList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(roomList);
    }

}
