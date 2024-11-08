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
    @JoinColumn(name = "room_id", referencedColumnName = "roomId", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", nullable = false)
    private Admin admin;

}
