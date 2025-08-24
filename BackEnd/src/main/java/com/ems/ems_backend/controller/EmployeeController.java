package com.ems.ems_backend.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    // Authentication endpoints removed

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getEmployeeDetail(@PathVariable Long id) {
    Optional<Employee> employeeOpt = employeeRepository.findById(id);
    return employeeOpt.<ResponseEntity<?>>map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Logout endpoint removed
}
