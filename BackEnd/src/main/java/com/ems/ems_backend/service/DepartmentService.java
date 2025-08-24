package com.ems.ems_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.model.Department;
import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.repository.DepartmentRepository;
import com.ems.ems_backend.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Optional<Department> getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }

    public Department saveDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    public boolean isDepartmentHead(String departmentName, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }

        // Get current user's employee record
        Optional<Employee> currentEmployee = getCurrentEmployee(authentication);
        if (currentEmployee.isEmpty()) {
            return false;
        }

        // Check if user is head of the specified department
        Optional<Department> department = departmentRepository.findByName(departmentName);
        return department.isPresent() &&
               department.get().getDepartmentHeadId() != null &&
               department.get().getDepartmentHeadId().equals(currentEmployee.get().getId());
    }

    public Department assignDepartmentHead(Long departmentId, Long employeeId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        department.setDepartmentHeadId(employeeId);
        return departmentRepository.save(department);
    }

    private Optional<Employee> getCurrentEmployee(Authentication authentication) {
        // Implementation depends on your User model structure
        // This is a placeholder - implement based on your authentication setup
        return Optional.empty();
    }
}
