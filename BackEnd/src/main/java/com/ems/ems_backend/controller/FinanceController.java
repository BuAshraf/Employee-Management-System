package com.ems.ems_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.dto.MessageResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FinanceController {

    @GetMapping("/salary-overview")
    public ResponseEntity<Map<String, Object>> getSalaryOverview() {
        Map<String, Object> overview = new HashMap<>();
        overview.put("totalPayroll", 500000.0);
        overview.put("averageSalary", 4166.67);
        overview.put("employeeCount", 120);
        overview.put("currency", "SAR");
        overview.put("departmentBreakdown", Map.of(
            "IT", Map.of("total", 150000.0, "employees", 30, "average", 5000.0),
            "HR", Map.of("total", 120000.0, "employees", 25, "average", 4800.0),
            "Finance", Map.of("total", 130000.0, "employees", 20, "average", 6500.0),
            "Sales", Map.of("total", 100000.0, "employees", 45, "average", 2222.22)
        ));
        overview.put("trends", Map.of(
            "monthlyGrowth", 2.5,
            "yearlyGrowth", 12.0,
            "budgetUtilization", 75.0
        ));
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/budget")
    public ResponseEntity<Map<String, Object>> getBudget() {
        Map<String, Object> budget = new HashMap<>();
        budget.put("totalBudget", 1000000.0);
        budget.put("allocatedBudget", 750000.0);
        budget.put("remainingBudget", 250000.0);
        budget.put("currency", "SAR");
        budget.put("fiscalYear", "2025");
        budget.put("departments", Map.of(
            "IT", Map.of("allocated", 300000.0, "used", 225000.0, "remaining", 75000.0),
            "HR", Map.of("allocated", 200000.0, "used", 150000.0, "remaining", 50000.0),
            "Finance", Map.of("allocated", 150000.0, "used", 130000.0, "remaining", 20000.0),
            "Sales", Map.of("allocated", 100000.0, "used", 95000.0, "remaining", 5000.0)
        ));
        return ResponseEntity.ok(budget);
    }

    @PutMapping("/budget/allocate")
    public ResponseEntity<MessageResponse> allocateBudget(@RequestBody Map<String, Object> allocation) {
        // Implementation for budget allocation
        return ResponseEntity.ok(new MessageResponse("Budget allocated successfully"));
    }

    @PostMapping("/salary/bulk-update")
    public ResponseEntity<MessageResponse> bulkUpdateSalaries(@RequestBody Map<String, Object> updates) {
        // Implementation for bulk salary updates
        return ResponseEntity.ok(new MessageResponse("Salaries updated successfully"));
    }
}
