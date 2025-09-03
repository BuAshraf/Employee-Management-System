package com.ems.ems_backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "finance_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinanceReport {

    public enum ReportType { MONTHLY, QUARTERLY, ANNUAL, PROJECT, DEPARTMENT }
    public enum Status { DRAFT, PENDING_REVIEW, APPROVED, PUBLISHED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "report_title", nullable = false)
    private String reportTitle;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "report_type", nullable = false, length = 20)
    private ReportType reportType;

    @NotNull
    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @NotNull
    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;

    @Column(name = "department")
    private String department;

    @Column(name = "total_revenue", precision = 19, scale = 4)
    private BigDecimal totalRevenue;

    @Column(name = "total_expenses", precision = 19, scale = 4)
    private BigDecimal totalExpenses;

    @Column(name = "net_profit", precision = 19, scale = 4)
    private BigDecimal netProfit;

    @Column(name = "budget_allocated", precision = 19, scale = 4)
    private BigDecimal budgetAllocated;

    @Column(name = "budget_used", precision = 19, scale = 4)
    private BigDecimal budgetUsed;

    @Column(name = "payroll_costs", precision = 19, scale = 4)
    private BigDecimal payrollCosts;

    @Column(name = "operational_costs", precision = 19, scale = 4)
    private BigDecimal operationalCosts;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 20)
  @Builder.Default
  private Status status = Status.DRAFT;

    @Column(name = "created_by_name")
    private String createdByName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
      this.createdAt = LocalDateTime.now();
      this.updatedAt = this.createdAt;
    }

    @PreUpdate
    void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}
