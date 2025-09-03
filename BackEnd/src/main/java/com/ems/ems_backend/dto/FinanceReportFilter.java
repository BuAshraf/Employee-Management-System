package com.ems.ems_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.ems.ems_backend.model.FinanceReport.ReportType;
import com.ems.ems_backend.model.FinanceReport.Status;

import lombok.Data;

@Data
public class FinanceReportFilter {
    private ReportType reportType;
    private Status status;
    private String department;
    private LocalDate periodStartFrom;
    private LocalDate periodStartTo;
    private LocalDate periodEndFrom;
    private LocalDate periodEndTo;
    // numeric ranges
    private BigDecimal totalRevenueMin;
    private BigDecimal totalRevenueMax;
    private BigDecimal totalExpensesMin;
    private BigDecimal totalExpensesMax;
    private BigDecimal netProfitMin;
    private BigDecimal netProfitMax;
    private BigDecimal budgetAllocatedMin;
    private BigDecimal budgetAllocatedMax;
    private BigDecimal budgetUsedMin;
    private BigDecimal budgetUsedMax;
}
