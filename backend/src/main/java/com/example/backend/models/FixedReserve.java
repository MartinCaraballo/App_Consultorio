package com.example.backend.models;

import com.example.backend.compositekeys.FixedReserveKey;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Fixed_Reserves")
public class FixedReserve {

    @EmbeddedId
    private FixedReserveKey fixedReserveKey;

    @ManyToOne
    @MapsId("roomId")
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email")
    private Admin admin;

}
