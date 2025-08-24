package com.ems.ems_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;

import com.ems.ems_backend.model.Employee;

public interface EmployeeService {
    // CRUD operations
    Employee create(Employee employee);
    Employee update(Long id, Employee employee);
    Employee updateStatus(Long id, Employee.Status status);
    void delete(Long id);
    Employee getById(Long id);
    List<Employee> getAll();

    // Search operations
    List<Employee> search(String query);
    List<Employee> getEmployeesByDepartment(String department);
    List<Employee> getEmployeesByStatus(Employee.Status status);
    Optional<Employee> getEmployeeByUserId(Long userId);

    // Security operations
    boolean isCurrentUser(Long employeeId, Authentication authentication);
}
