package com.ems.ems_backend.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.dto.LeaveRequestFilter;
import com.ems.ems_backend.dto.LeaveRequestRequest;
import com.ems.ems_backend.dto.LeaveRequestResponse;
import com.ems.ems_backend.model.LeaveRequest;
import com.ems.ems_backend.repository.LeaveRequestRepository;
import com.ems.ems_backend.mapper.LeaveRequestMapper;
import com.ems.ems_backend.repository.spec.LeaveRequestSpecifications;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {
    private final LeaveRequestRepository repository;
    private final LeaveRequestMapper mapper;

    public Page<LeaveRequestResponse> list(LeaveRequestFilter filter, Pageable pageable) {
    Specification<LeaveRequest> spec = Specification
        .where(LeaveRequestSpecifications.hasEmployeeId(filter != null ? filter.getEmployeeId() : null))
        .and(LeaveRequestSpecifications.hasType(filter != null ? filter.getLeaveType() : null))
        .and(LeaveRequestSpecifications.hasStatus(filter != null ? filter.getStatus() : null))
        .and(LeaveRequestSpecifications.startDateBetween(filter != null ? filter.getStartDateFrom() : null,
            filter != null ? filter.getStartDateTo() : null))
        .and(LeaveRequestSpecifications.endDateBetween(filter != null ? filter.getEndDateFrom() : null,
            filter != null ? filter.getEndDateTo() : null));
        return repository.findAll(spec, pageable).map(mapper::toResponse);
    }

    public LeaveRequestResponse get(Long id) {
        return repository.findById(id).map(mapper::toResponse).orElse(null);
    }

    public LeaveRequestResponse create(LeaveRequestRequest req) {
        LeaveRequest entity = mapper.toEntity(req);
        if (entity.getStatus() == null) entity.setStatus(LeaveRequest.Status.PENDING);
        return mapper.toResponse(repository.save(entity));
    }

    public LeaveRequestResponse update(Long id, LeaveRequestRequest req) {
        return repository.findById(id)
                .map(existing -> {
                    LeaveRequest updated = mapper.toEntity(req);
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

    // Mapping moved to MapStruct
}
