package com.ems.ems_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.ems.ems_backend.model.CompanyMetric.MetricType;
import com.ems.ems_backend.model.CompanyMetric.Period;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyMetricResponse {
    private Long id;
    private MetricType metricType;
    private Period period;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal value;
    private BigDecimal target;
    private String unit;
    private String notes;
    private LocalDateTime lastUpdated;
}
