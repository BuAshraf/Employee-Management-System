package com.ems.ems_backend.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.dto.FinanceReportFilter;
import com.ems.ems_backend.dto.FinanceReportRequest;
import com.ems.ems_backend.dto.FinanceReportResponse;
import com.ems.ems_backend.model.FinanceReport;
import com.ems.ems_backend.repository.FinanceReportRepository;
import com.ems.ems_backend.repository.spec.FinanceReportSpecifications;
import com.ems.ems_backend.mapper.FinanceReportMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FinanceReportService {
    private final FinanceReportRepository repository;
    private final FinanceReportMapper mapper;

    public Page<FinanceReportResponse> list(FinanceReportFilter filter, Pageable pageable) {
    Specification<FinanceReport> spec = Specification
        .where(FinanceReportSpecifications.hasType(filter != null ? filter.getReportType() : null))
        .and(FinanceReportSpecifications.hasStatus(filter != null ? filter.getStatus() : null))
        .and(FinanceReportSpecifications.hasDepartment(filter != null ? filter.getDepartment() : null))
        .and(FinanceReportSpecifications.periodStartBetween(filter != null ? filter.getPeriodStartFrom() : null,
            filter != null ? filter.getPeriodStartTo() : null))
        .and(FinanceReportSpecifications.periodEndBetween(filter != null ? filter.getPeriodEndFrom() : null,
            filter != null ? filter.getPeriodEndTo() : null))
        .and(FinanceReportSpecifications.betweenBigDecimal("totalRevenue", filter != null ? filter.getTotalRevenueMin() : null,
            filter != null ? filter.getTotalRevenueMax() : null))
        .and(FinanceReportSpecifications.betweenBigDecimal("totalExpenses", filter != null ? filter.getTotalExpensesMin() : null,
            filter != null ? filter.getTotalExpensesMax() : null))
        .and(FinanceReportSpecifications.betweenBigDecimal("netProfit", filter != null ? filter.getNetProfitMin() : null,
            filter != null ? filter.getNetProfitMax() : null))
        .and(FinanceReportSpecifications.betweenBigDecimal("budgetAllocated", filter != null ? filter.getBudgetAllocatedMin() : null,
            filter != null ? filter.getBudgetAllocatedMax() : null))
        .and(FinanceReportSpecifications.betweenBigDecimal("budgetUsed", filter != null ? filter.getBudgetUsedMin() : null,
            filter != null ? filter.getBudgetUsedMax() : null));
    return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    public FinanceReportResponse get(Long id) {
    return repository.findById(id).map(mapper::toResponse).orElse(null);
    }

    public FinanceReportResponse create(FinanceReportRequest req) {
    FinanceReport entity = mapper.toEntity(req);
    if (entity.getStatus() == null) entity.setStatus(FinanceReport.Status.DRAFT);
    return mapper.toResponse(repository.save(entity));
    }

    public FinanceReportResponse update(Long id, FinanceReportRequest req) {
        return repository.findById(id)
                .map(existing -> {
                    FinanceReport updated = mapper.toEntity(req);
                    updated.setId(existing.getId());
                    if (updated.getStatus() == null) updated.setStatus(existing.getStatus());
                    return mapper.toResponse(repository.save(updated));
                })
                .orElse(null);
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }

    // Mapping now via MapStruct
}
