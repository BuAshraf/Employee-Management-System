package com.ems.ems_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import com.ems.ems_backend.dto.CompanyMetricFilter;
import com.ems.ems_backend.dto.CompanyMetricRequest;
import com.ems.ems_backend.dto.CompanyMetricResponse;
import com.ems.ems_backend.dto.ValidationGroups;
import com.ems.ems_backend.model.CompanyMetric;
import com.ems.ems_backend.service.CompanyMetricService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/company-metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CompanyMetricController {

    private final CompanyMetricService service;

    @GetMapping
    public ResponseEntity<Page<CompanyMetricResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) CompanyMetric.MetricType metricType,
            @RequestParam(required = false) CompanyMetric.Period period,
            @RequestParam(required = false) String periodStartFrom,
            @RequestParam(required = false) String periodStartTo,
            @RequestParam(required = false) String periodEndFrom,
            @RequestParam(required = false) String periodEndTo) {
        Pageable pageable = PageRequest.of(page, size);
        CompanyMetricFilter filter = new CompanyMetricFilter();
        filter.setMetricType(metricType);
        filter.setPeriod(period);
        if (periodStartFrom != null) filter.setPeriodStartFrom(java.time.LocalDate.parse(periodStartFrom));
        if (periodStartTo != null) filter.setPeriodStartTo(java.time.LocalDate.parse(periodStartTo));
        if (periodEndFrom != null) filter.setPeriodEndFrom(java.time.LocalDate.parse(periodEndFrom));
        if (periodEndTo != null) filter.setPeriodEndTo(java.time.LocalDate.parse(periodEndTo));
        return ResponseEntity.ok(service.list(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyMetricResponse> get(@PathVariable Long id) {
        CompanyMetricResponse res = service.get(id);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CompanyMetricResponse> create(@Validated(ValidationGroups.Create.class) @RequestBody CompanyMetricRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyMetricResponse> update(@PathVariable Long id, @Validated(ValidationGroups.Update.class) @RequestBody CompanyMetricRequest request) {
        CompanyMetricResponse res = service.update(id, request);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
