package com.ems.ems_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSettingsRequest {
    private String companyName;
    private String companyEmail;
    private String companyPhone;
    private String companyAddress;
    private Integer defaultVacationDays;
    private String currency;
    private String dateFormat;
    private String theme;
    private String timezone;
    
    private NotificationSettingsRequest notifications;
    private BackupSettingsRequest backup;
    private SecuritySettingsRequest security;
    private EmailSettingsRequest email;
}
