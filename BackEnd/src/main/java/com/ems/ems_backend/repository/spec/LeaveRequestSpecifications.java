package com.ems.ems_backend.repository.spec;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.ems.ems_backend.model.LeaveRequest;

public class LeaveRequestSpecifications {
    public static Specification<LeaveRequest> hasEmployeeId(String employeeId) {
        return (root, cq, cb) -> employeeId == null || employeeId.isBlank() ? null : cb.equal(root.get("employeeId"), employeeId);
    }
    public static Specification<LeaveRequest> hasType(LeaveRequest.LeaveType type) {
        return (root, cq, cb) -> type == null ? null : cb.equal(root.get("leaveType"), type);
    }
    public static Specification<LeaveRequest> hasStatus(LeaveRequest.Status status) {
        return (root, cq, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }
    public static Specification<LeaveRequest> startDateBetween(LocalDate from, LocalDate to) {
        return (root, cq, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("startDate"), from, to);
            return from != null ? cb.greaterThanOrEqualTo(root.get("startDate"), from)
                    : cb.lessThanOrEqualTo(root.get("startDate"), to);
        };
    }
    public static Specification<LeaveRequest> endDateBetween(LocalDate from, LocalDate to) {
        return (root, cq, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("endDate"), from, to);
            return from != null ? cb.greaterThanOrEqualTo(root.get("endDate"), from)
                    : cb.lessThanOrEqualTo(root.get("endDate"), to);
        };
    }
}
