package com.harvesthub.dto;

import lombok.Data;

@Data
public class SignUpRequest {
    private String email;
    private String password;
    private String name;
    private String type; // Customer, Farmer, Admin
    private String phNo;
    private String location;
}

