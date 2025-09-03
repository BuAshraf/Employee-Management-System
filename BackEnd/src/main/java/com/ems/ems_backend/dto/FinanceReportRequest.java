package com.ems.ems_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.ems.ems_backend.model.FinanceReport.ReportType;
import com.ems.ems_backend.model.FinanceReport.Status;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FinanceReportRequest {
    @NotBlank(groups = {ValidationGroups.Create.class})
    @Size(max = 255)
    private String reportTitle;

    @NotNull(groups = {ValidationGroups.Create.class})
    private ReportType reportType;

    @NotNull(groups = {ValidationGroups.Create.class})
    private LocalDate periodStart;

    @NotNull(groups = {ValidationGroups.Create.class})
    private LocalDate periodEnd;

    private String department;
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netProfit;
    private BigDecimal budgetAllocated;
    private BigDecimal budgetUsed;
    private BigDecimal payrollCosts;
    private BigDecimal operationalCosts;
    @Size(max = 4000)
    private String summary;
    private Status status; // optional; defaults to DRAFT if null
    private String createdByName;
}