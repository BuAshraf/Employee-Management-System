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
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "company_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyMetric {

    public enum MetricType { REVENUE, EXPENSE, PROFIT, HEADCOUNT, TURNOVER_RATE, CUSTOMER_SATISFACTION }
    public enum Period { DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "metric_type", nullable = false, length = 30)
    private MetricType metricType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "period", nullable = false, length = 20)
    private Period period;

    @NotNull
    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;

    @NotNull
    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;

    @Column(name = "value", precision = 19, scale = 4)
    private BigDecimal value;

    @Column(name = "target", precision = 19, scale = 4)
    private BigDecimal target;

    @Column(name = "unit")
    private String unit;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    void onCreate() { this.lastUpdated = LocalDateTime.now(); }

    @PreUpdate
    void onUpdate() { this.lastUpdated = LocalDateTime.now(); }
}
