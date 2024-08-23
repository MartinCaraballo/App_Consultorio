package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.Set;

@Data
@Entity
@Table(name = "Rooms")
public class Room {
    @Id
    private Integer roomId;

    @OneToMany(mappedBy = "room")
    Set<UserReserve> reserves;
}
