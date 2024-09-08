package com.example.backend.services;

import com.example.backend.repositories.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<Integer> findAllRoomIds() {
        return roomRepository.findAllRoomIds();
    }
}
