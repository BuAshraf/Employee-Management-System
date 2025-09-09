package com.ems.ems_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    // New: required to login to a specific company/tenant
    @NotBlank
    private String companyKey;
}

