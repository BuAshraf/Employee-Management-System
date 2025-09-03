package com.ems.ems_backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.ems.ems_backend.dto.LeaveRequestRequest;
import com.ems.ems_backend.dto.LeaveRequestResponse;
import com.ems.ems_backend.model.LeaveRequest;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeaveRequestMapper {
    LeaveRequest toEntity(LeaveRequestRequest request);
    LeaveRequestResponse toResponse(LeaveRequest entity);
}
