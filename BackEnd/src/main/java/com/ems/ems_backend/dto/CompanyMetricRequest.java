package com.ems.ems_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.ems.ems_backend.model.CompanyMetric.MetricType;
import com.ems.ems_backend.model.CompanyMetric.Period;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CompanyMetricRequest {
    @NotNull(groups = {ValidationGroups.Create.class})
    private MetricType metricType;
    @NotNull(groups = {ValidationGroups.Create.class})
    private Period period;
    @NotNull(groups = {ValidationGroups.Create.class})
    private LocalDate periodStart;
    @NotNull(groups = {ValidationGroups.Create.class})
    private LocalDate periodEnd;
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal value;
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal target;
    @Size(max = 50)
    private String unit;
    @Size(max = 2000)
    private String notes;
}
