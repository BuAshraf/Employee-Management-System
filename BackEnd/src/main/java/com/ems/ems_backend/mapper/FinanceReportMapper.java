package com.ems.ems_backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.ems.ems_backend.dto.FinanceReportRequest;
import com.ems.ems_backend.dto.FinanceReportResponse;
import com.ems.ems_backend.model.FinanceReport;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FinanceReportMapper {
    FinanceReport toEntity(FinanceReportRequest request);

    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    FinanceReportResponse toResponse(FinanceReport entity);
}
