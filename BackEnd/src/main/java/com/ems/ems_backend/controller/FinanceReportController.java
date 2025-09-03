package com.ems.ems_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import com.ems.ems_backend.dto.FinanceReportFilter;
import com.ems.ems_backend.dto.FinanceReportRequest;
import com.ems.ems_backend.dto.FinanceReportResponse;
import com.ems.ems_backend.dto.ValidationGroups;
import com.ems.ems_backend.model.FinanceReport;
import com.ems.ems_backend.service.FinanceReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/finance-reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FinanceReportController {

    private final FinanceReportService service;

    @GetMapping
    public ResponseEntity<Page<FinanceReportResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) FinanceReport.ReportType reportType,
            @RequestParam(required = false) FinanceReport.Status status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String periodStartFrom,
            @RequestParam(required = false) String periodStartTo,
            @RequestParam(required = false) String periodEndFrom,
            @RequestParam(required = false) String periodEndTo,
            @RequestParam(required = false) String totalRevenueMin,
            @RequestParam(required = false) String totalRevenueMax,
            @RequestParam(required = false) String totalExpensesMin,
            @RequestParam(required = false) String totalExpensesMax,
            @RequestParam(required = false) String netProfitMin,
            @RequestParam(required = false) String netProfitMax,
            @RequestParam(required = false) String budgetAllocatedMin,
            @RequestParam(required = false) String budgetAllocatedMax,
            @RequestParam(required = false) String budgetUsedMin,
            @RequestParam(required = false) String budgetUsedMax) {
        Pageable pageable = PageRequest.of(page, size);
        FinanceReportFilter filter = new FinanceReportFilter();
        filter.setReportType(reportType);
        filter.setStatus(status);
        filter.setDepartment(department);
        // parse dates if provided (ISO-8601 yyyy-MM-dd)
        if (periodStartFrom != null) filter.setPeriodStartFrom(java.time.LocalDate.parse(periodStartFrom));
        if (periodStartTo != null) filter.setPeriodStartTo(java.time.LocalDate.parse(periodStartTo));
        if (periodEndFrom != null) filter.setPeriodEndFrom(java.time.LocalDate.parse(periodEndFrom));
        if (periodEndTo != null) filter.setPeriodEndTo(java.time.LocalDate.parse(periodEndTo));
        // numeric ranges
        java.util.function.Function<String, java.math.BigDecimal> toBD = s -> s == null ? null : new java.math.BigDecimal(s);
        filter.setTotalRevenueMin(toBD.apply(totalRevenueMin));
        filter.setTotalRevenueMax(toBD.apply(totalRevenueMax));
        filter.setTotalExpensesMin(toBD.apply(totalExpensesMin));
        filter.setTotalExpensesMax(toBD.apply(totalExpensesMax));
        filter.setNetProfitMin(toBD.apply(netProfitMin));
        filter.setNetProfitMax(toBD.apply(netProfitMax));
        filter.setBudgetAllocatedMin(toBD.apply(budgetAllocatedMin));
        filter.setBudgetAllocatedMax(toBD.apply(budgetAllocatedMax));
        filter.setBudgetUsedMin(toBD.apply(budgetUsedMin));
        filter.setBudgetUsedMax(toBD.apply(budgetUsedMax));
        return ResponseEntity.ok(service.list(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinanceReportResponse> get(@PathVariable Long id) {
        FinanceReportResponse res = service.get(id);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<FinanceReportResponse> create(@Validated(ValidationGroups.Create.class) @RequestBody FinanceReportRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinanceReportResponse> update(@PathVariable Long id, @Validated(ValidationGroups.Update.class) @RequestBody FinanceReportRequest request) {
        FinanceReportResponse res = service.update(id, request);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
