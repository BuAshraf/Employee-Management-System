package com.ems.ems_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ems.ems_backend.model.LeaveRequest.LeaveType;
import com.ems.ems_backend.model.LeaveRequest.Status;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeaveRequestResponse {
    private Long id;
    private String employeeId;
    private String employeeName;
    private LeaveType leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer daysRequested;
    private String reason;
    private Status status;
    private String approvedBy;
    private LocalDateTime approvedDate;
    private String comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
