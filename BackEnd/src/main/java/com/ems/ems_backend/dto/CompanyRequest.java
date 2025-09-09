package com.ems.ems_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompanyRequest {
    @NotBlank(groups = ValidationGroups.Create.class)
    @Size(min = 2, max = 255)
    private String name;

    @NotBlank(groups = ValidationGroups.Create.class)
    @Size(min = 2, max = 100)
    private String companyKey;

    private String dbUrl;
    private String dbUsername;
    private String dbPassword;
    private Boolean active;
}
