package com.ems.ems_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ems.ems_backend.model.FinanceReport.ReportType;
import com.ems.ems_backend.model.FinanceReport.Status;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FinanceReportResponse {
    private Long id;
    private String reportTitle;
    private ReportType reportType;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private String department;
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netProfit;
    private BigDecimal budgetAllocated;
    private BigDecimal budgetUsed;
    private BigDecimal payrollCosts;
    private BigDecimal operationalCosts;
    private String summary;
    private Status status;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
