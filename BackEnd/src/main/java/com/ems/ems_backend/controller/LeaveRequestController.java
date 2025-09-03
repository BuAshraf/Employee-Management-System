package com.ems.ems_backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import com.ems.ems_backend.dto.LeaveRequestFilter;
import com.ems.ems_backend.dto.LeaveRequestRequest;
import com.ems.ems_backend.dto.LeaveRequestResponse;
import com.ems.ems_backend.dto.ValidationGroups;
import com.ems.ems_backend.model.LeaveRequest;
import com.ems.ems_backend.service.LeaveRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LeaveRequestController {

    private final LeaveRequestService service;

    @GetMapping
    public ResponseEntity<Page<LeaveRequestResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) LeaveRequest.LeaveType leaveType,
            @RequestParam(required = false) LeaveRequest.Status status,
            @RequestParam(required = false) String startDateFrom,
            @RequestParam(required = false) String startDateTo,
            @RequestParam(required = false) String endDateFrom,
            @RequestParam(required = false) String endDateTo) {
        Pageable pageable = PageRequest.of(page, size);
        LeaveRequestFilter filter = new LeaveRequestFilter();
        filter.setEmployeeId(employeeId);
        filter.setLeaveType(leaveType);
        filter.setStatus(status);
        if (startDateFrom != null) filter.setStartDateFrom(java.time.LocalDate.parse(startDateFrom));
        if (startDateTo != null) filter.setStartDateTo(java.time.LocalDate.parse(startDateTo));
        if (endDateFrom != null) filter.setEndDateFrom(java.time.LocalDate.parse(endDateFrom));
        if (endDateTo != null) filter.setEndDateTo(java.time.LocalDate.parse(endDateTo));
        return ResponseEntity.ok(service.list(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequestResponse> get(@PathVariable Long id) {
        LeaveRequestResponse res = service.get(id);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<LeaveRequestResponse> create(@Validated(ValidationGroups.Create.class) @RequestBody LeaveRequestRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequestResponse> update(@PathVariable Long id, @Validated(ValidationGroups.Update.class) @RequestBody LeaveRequestRequest request) {
        LeaveRequestResponse res = service.update(id, request);
        return res != null ? ResponseEntity.ok(res) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
