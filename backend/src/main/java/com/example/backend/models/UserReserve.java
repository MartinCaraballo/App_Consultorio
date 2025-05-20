package com.example.backend.models;

import com.example.backend.compositekeys.UserReserveKey;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;


@Data
@Entity
@Table(name = "Users_Reserves")
public class UserReserve {

    @EmbeddedId
    private UserReserveKey reserveKey;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "room_id", referencedColumnName = "roomId", nullable = false)
    private Room room;

    private Boolean isMonthly;
    private LocalDateTime dateTimeReserved;
}
