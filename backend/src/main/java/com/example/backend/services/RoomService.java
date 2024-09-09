package com.example.backend.services;

import com.example.backend.models.Room;
import com.example.backend.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Integer> findAllRoomIds() {
        return roomRepository.findAllRoomIds();
    }

    public Optional<Room> findRoomById(Integer id) {
        return roomRepository.findById(id);
    }
}
