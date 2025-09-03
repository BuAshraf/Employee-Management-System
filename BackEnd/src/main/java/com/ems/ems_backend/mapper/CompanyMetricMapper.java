package com.ems.ems_backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.ems.ems_backend.dto.CompanyMetricRequest;
import com.ems.ems_backend.dto.CompanyMetricResponse;
import com.ems.ems_backend.model.CompanyMetric;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CompanyMetricMapper {
    CompanyMetric toEntity(CompanyMetricRequest request);
    CompanyMetricResponse toResponse(CompanyMetric entity);
}
