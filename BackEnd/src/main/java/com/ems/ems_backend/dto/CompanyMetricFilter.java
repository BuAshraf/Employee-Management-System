package com.ems.ems_backend.dto;

import java.time.LocalDate;

import com.ems.ems_backend.model.CompanyMetric.MetricType;
import com.ems.ems_backend.model.CompanyMetric.Period;

import lombok.Data;

@Data
public class CompanyMetricFilter {
    private MetricType metricType;
    private Period period;
    private LocalDate periodStartFrom;
    private LocalDate periodStartTo;
    private LocalDate periodEndFrom;
    private LocalDate periodEndTo;
}
