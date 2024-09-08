package com.example.backend.models.requests;

import lombok.Data;

import java.sql.Date;

@Data
public class FindReserveReq {
    private Integer roomId;
    private Integer dayIndex;
    private Date date;
}
