package com.ems.ems_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SecuritySettingsRequest {
    private Integer passwordMinLength;
    private Boolean requireSpecialChars;
    private Boolean requireNumbers;
    private Boolean requireUppercase;
    private Integer sessionTimeout;
    private Boolean twoFactorRequired;
    private Integer loginAttempts;
    private Integer lockoutDuration;
}
