package com.ems.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String status;
    private Long id;
    private String email;
    private String employeeId;
    private String department;
    private String role;
}
