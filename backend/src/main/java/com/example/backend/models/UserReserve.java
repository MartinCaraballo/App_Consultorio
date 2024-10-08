package com.example.backend.models;

import com.example.backend.compositekeys.UserReserveKey;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;


@Data
@Entity
@Table(name = "Users_Reserves")
public class UserReserve {

    @EmbeddedId
    private UserReserveKey reserveKey;

    @ManyToOne
    @MapsId("email")
    @JoinColumn(name = "email")
    private User user;

    @ManyToOne
    @MapsId("roomId")
    @JoinColumn(name = "room_id")
    private Room room;
}
