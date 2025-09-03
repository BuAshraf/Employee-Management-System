package com.ems.ems_backend.service;

import com.ems.ems_backend.mapper.CompanyMetricMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.dto.CompanyMetricFilter;
import com.ems.ems_backend.dto.CompanyMetricRequest;
import com.ems.ems_backend.dto.CompanyMetricResponse;
import com.ems.ems_backend.model.CompanyMetric;
import com.ems.ems_backend.repository.CompanyMetricRepository;
import com.ems.ems_backend.repository.spec.CompanyMetricSpecifications;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CompanyMetricService {
    private final CompanyMetricRepository repository;
    private final CompanyMetricMapper mapper;

    public Page<CompanyMetricResponse> list(CompanyMetricFilter filter, Pageable pageable) {
    Specification<CompanyMetric> spec = Specification
        .where(CompanyMetricSpecifications.hasType(filter != null ? filter.getMetricType() : null))
        .and(CompanyMetricSpecifications.hasPeriod(filter != null ? filter.getPeriod() : null))
        .and(CompanyMetricSpecifications.periodStartBetween(filter != null ? filter.getPeriodStartFrom() : null,
            filter != null ? filter.getPeriodStartTo() : null))
        .and(CompanyMetricSpecifications.periodEndBetween(filter != null ? filter.getPeriodEndFrom() : null,
            filter != null ? filter.getPeriodEndTo() : null));
        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    public CompanyMetricResponse get(Long id) {
        return repository.findById(id).map(mapper::toResponse).orElse(null);
    }

    public CompanyMetricResponse create(CompanyMetricRequest req) {
        CompanyMetric entity = mapper.toEntity(req);
        return mapper.toResponse(repository.save(entity));
    }

    public CompanyMetricResponse update(Long id, CompanyMetricRequest req) {
        return repository.findById(id)
                .map(existing -> {
                    CompanyMetric updated = mapper.toEntity(req);
                    updated.setId(existing.getId());
                    return mapper.toResponse(repository.save(updated));
                })
                .orElse(null);
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }

    // Mapping moved to MapStruct
}
