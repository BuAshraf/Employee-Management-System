package com.ems.ems_backend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.service.EmployeeService;
import com.ems.ems_backend.utils.EmployeeIdGenerator;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeRestController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAll();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getById(id);
        return ResponseEntity.ok(employee);
    }

    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        // Generate employee ID if not provided
        if (employee.getEmployeeId() == null || employee.getEmployeeId().isEmpty()) {
            String fullName = (employee.getFirstName() != null ? employee.getFirstName() : "") + 
                             " " + (employee.getLastName() != null ? employee.getLastName() : "");
            employee.setEmployeeId(EmployeeIdGenerator.generateId(fullName.trim(), employee.getDepartment()));
        }
        
        // Set hire date if not provided
        if (employee.getHireDate() == null) {
            employee.setHireDate(LocalDate.now());
        }
        
        // Set default status if not provided
        if (employee.getStatus() == null) {
            employee.setStatus(Employee.Status.ACTIVE);
        }
        
        // Set timestamps
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        
        Employee savedEmployee = employeeService.create(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        employee.setUpdatedAt(LocalDateTime.now());
        Employee updatedEmployee = employeeService.update(id, employee);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(@RequestParam String query) {
        List<Employee> employees = employeeService.search(query);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Employee>> getEmployeesByStatus(@PathVariable Employee.Status status) {
        List<Employee> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(employees);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Employee> updateEmployeeStatus(@PathVariable Long id, @RequestParam Employee.Status status) {
        Employee updatedEmployee = employeeService.updateStatus(id, status);
        return ResponseEntity.ok(updatedEmployee);
    }
}
