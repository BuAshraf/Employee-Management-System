package com.ems.ems_backend.dto;

import java.time.LocalDate;

import com.ems.ems_backend.model.LeaveRequest.LeaveType;
import com.ems.ems_backend.model.LeaveRequest.Status;

import lombok.Data;

@Data
public class LeaveRequestFilter {
    private String employeeId;
    private LeaveType leaveType;
    private Status status;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private LocalDate endDateFrom;
    private LocalDate endDateTo;
}
