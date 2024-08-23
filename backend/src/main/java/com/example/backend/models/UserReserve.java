package com.example.backend.models;

import com.example.backend.compositekeys.UserReserveKey;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;


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

    @Column(name = "reserve_date", nullable = false)
    private Date reserveDate;
}
