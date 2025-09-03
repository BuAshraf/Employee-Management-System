package com.ems.ems_backend.repository.spec;

import java.time.LocalDate;
import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.ems.ems_backend.model.FinanceReport;

public class FinanceReportSpecifications {
    public static Specification<FinanceReport> hasType(FinanceReport.ReportType type) {
        return (root, cq, cb) -> type == null ? null : cb.equal(root.get("reportType"), type);
    }
    public static Specification<FinanceReport> hasStatus(FinanceReport.Status status) {
        return (root, cq, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
    public static Specification<FinanceReport> hasDepartment(String dept) {
        return (root, cq, cb) -> dept == null || dept.isBlank() ? null : cb.equal(root.get("department"), dept);
    }
    public static Specification<FinanceReport> periodStartBetween(LocalDate from, LocalDate to) {
        return (root, cq, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("periodStart"), from, to);
            return from != null ? cb.greaterThanOrEqualTo(root.get("periodStart"), from)
                    : cb.lessThanOrEqualTo(root.get("periodStart"), to);
        };
    }
    public static Specification<FinanceReport> periodEndBetween(LocalDate from, LocalDate to) {
        return (root, cq, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("periodEnd"), from, to);
            return from != null ? cb.greaterThanOrEqualTo(root.get("periodEnd"), from)
                    : cb.lessThanOrEqualTo(root.get("periodEnd"), to);
        };
    }
    public static Specification<FinanceReport> betweenBigDecimal(String field, BigDecimal min, BigDecimal max) {
        return (root, cq, cb) -> {
            if (min == null && max == null) return null;
            if (min != null && max != null) return cb.between(root.get(field), min, max);
            return min != null ? cb.greaterThanOrEqualTo(root.get(field), min)
                    : cb.lessThanOrEqualTo(root.get(field), max);
        };
    }
}
