package com.ems.ems_backend.repository.spec;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.ems.ems_backend.model.CompanyMetric;

public class CompanyMetricSpecifications {
    public static Specification<CompanyMetric> hasType(CompanyMetric.MetricType type) {
        return (root, cq, cb) -> type == null ? null : cb.equal(root.get("metricType"), type);
    }
    public static Specification<CompanyMetric> hasPeriod(CompanyMetric.Period period) {
        return (root, cq, cb) -> period == null ? null : cb.equal(root.get("period"), period);
    }
    public static Specification<CompanyMetric> periodStartBetween(LocalDate from, LocalDate to) {
        return (root, cq, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("periodStart"), from, to);
            return from != null ? cb.greaterThanOrEqualTo(root.get("periodStart"), from)
                    : cb.lessThanOrEqualTo(root.get("periodStart"), to);
        };
    }
    public static Specification<CompanyMetric> periodEndBetween(LocalDate from, LocalDate to) {
        return (root, cq, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("periodEnd"), from, to);
            return from != null ? cb.greaterThanOrEqualTo(root.get("periodEnd"), from)
                    : cb.lessThanOrEqualTo(root.get("periodEnd"), to);
        };
    }
}
