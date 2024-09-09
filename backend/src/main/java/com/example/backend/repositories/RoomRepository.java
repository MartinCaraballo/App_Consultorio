package com.example.backend.repositories;

import com.example.backend.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    @Query("SELECT r.roomId FROM Room r")
    List<Integer> findAllRoomIds();

}
