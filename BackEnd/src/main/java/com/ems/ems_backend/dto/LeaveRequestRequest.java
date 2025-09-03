package com.ems.ems_backend.dto;

import java.time.LocalDate;

import com.ems.ems_backend.model.LeaveRequest.LeaveType;
import com.ems.ems_backend.model.LeaveRequest.Status;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LeaveRequestRequest {
    @NotBlank(groups = {ValidationGroups.Create.class})
    private String employeeId;
    @Size(max = 255)
    private String employeeName;
    @NotNull(groups = {ValidationGroups.Create.class})
    private LeaveType leaveType;
    @NotNull(groups = {ValidationGroups.Create.class})
    private LocalDate startDate;
    @NotNull(groups = {ValidationGroups.Create.class})
    private LocalDate endDate;
    @Positive
    private Integer daysRequested;
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Size(max = 4000)
    private String reason;
    private Status status; // optional; defaults to PENDING if null
    @Size(max = 255)
    private String approvedBy;
    @Size(max = 4000)
    private String comments;
}
