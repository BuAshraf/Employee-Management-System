package com.ems.ems_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BackupSettingsRequest {
    private Boolean autoBackup;
    private String backupFrequency;
    private Integer retentionPeriod;
}
