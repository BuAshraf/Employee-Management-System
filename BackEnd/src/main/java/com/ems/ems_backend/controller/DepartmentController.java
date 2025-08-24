package com.ems.ems_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.dto.MessageResponse;
import com.ems.ems_backend.model.Department;
import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.repository.EmployeeRepository;
import com.ems.ems_backend.service.DepartmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;
    private final EmployeeRepository employeeRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllDepartments() {
        List<Department> departments = departmentService.getAllDepartments();

        Map<String, Object> response = new HashMap<>();
        Map<String, Object> departmentData = departments.stream()
            .collect(Collectors.toMap(
                Department::getName,
                dept -> {
                    Map<String, Object> deptInfo = new HashMap<>();

                    // Get department head info
                    String headName = "Not Assigned";
                    if (dept.getDepartmentHeadId() != null) {
                        employeeRepository.findById(dept.getDepartmentHeadId())
                            .ifPresent(head -> deptInfo.put("head", head.getFullName()));
                    }
                    if (!deptInfo.containsKey("head")) {
                        deptInfo.put("head", headName);
                    }

                    // Get employee count - use the new method that supports both string and entity
                    List<Employee> deptEmployees = employeeRepository.findByDepartmentNameAll(dept.getName());
                    deptInfo.put("employees", deptEmployees.size());
                    deptInfo.put("description", dept.getDescription());
                    deptInfo.put("budget_allocated", dept.getBudgetAllocated());
                    deptInfo.put("budget_spent", dept.getBudgetSpent());
                    deptInfo.put("budget_remaining", dept.getRemainingBudget());
                    deptInfo.put("status", dept.getStatus());

                    return deptInfo;
                }
            ));

        response.put("departments", departmentData);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody Map<String, Object> departmentRequest) {
        try {
            String name = (String) departmentRequest.get("name");
            String description = (String) departmentRequest.get("description");
            Double budget = departmentRequest.get("budget") != null ?
                Double.valueOf(departmentRequest.get("budget").toString()) : 0.0;

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Department name is required"));
            }

            Department department = new Department();
            department.setName(name);
            department.setDescription(description);
            department.setBudgetAllocated(budget);
            department.setStatus(Department.Status.ACTIVE);

            Department savedDepartment = departmentService.saveDepartment(department);
            return ResponseEntity.ok(new MessageResponse("Department '" + name + "' created successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error creating department: " + e.getMessage()));
        }
    }

    @PutMapping("/{departmentId}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long departmentId,
                                            @RequestBody Map<String, Object> updates) {
        try {
            Department department = departmentService.getDepartmentById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

            if (updates.containsKey("name")) {
                department.setName((String) updates.get("name"));
            }
            if (updates.containsKey("description")) {
                department.setDescription((String) updates.get("description"));
            }
            if (updates.containsKey("budget_allocated")) {
                department.setBudgetAllocated(Double.valueOf(updates.get("budget_allocated").toString()));
            }
            if (updates.containsKey("status")) {
                department.setStatus(Department.Status.valueOf((String) updates.get("status")));
            }

            departmentService.saveDepartment(department);
            return ResponseEntity.ok(new MessageResponse("Department updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error updating department: " + e.getMessage()));
        }
    }

    @PutMapping("/{departmentId}/assign-head/{employeeId}")
    public ResponseEntity<?> assignDepartmentHead(@PathVariable Long departmentId,
                                                @PathVariable Long employeeId) {
        try {
            // Update employee role to DEPARTMENT_HEAD
            Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

            if (employee.getUser() != null) {
                employee.getUser().setRole(com.ems.ems_backend.model.User.Role.DEPARTMENT_HEAD);
            }

            // Assign as department head
            Department department = departmentService.assignDepartmentHead(departmentId, employeeId);

            return ResponseEntity.ok(new MessageResponse(
                "Employee " + employee.getFullName() +
                " assigned as head of " + department.getName() + " department"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error assigning department head: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long departmentId) {
        try {
            Department department = departmentService.getDepartmentById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

            // Check if department has employees - use the improved method
            List<Employee> employees = employeeRepository.findByDepartmentNameAll(department.getName());
            if (!employees.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Cannot delete department with existing employees. Please reassign employees first."));
            }

            departmentService.deleteDepartment(departmentId);
            return ResponseEntity.ok(new MessageResponse("Department deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error deleting department: " + e.getMessage()));
        }
    }

    @PutMapping("/manage/{departmentId}")
    public ResponseEntity<MessageResponse> manageDepartment(@PathVariable Long departmentId,
                                                           @RequestBody Map<String, Object> updates) {
        // Department heads can manage their own departments
        return ResponseEntity.ok(new MessageResponse("Department updated successfully"));
    }

    @GetMapping("/{departmentId}/budget")
    public ResponseEntity<Map<String, Object>> getDepartmentBudget(@PathVariable Long departmentId) {
        try {
            Department department = departmentService.getDepartmentById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

            Map<String, Object> budget = new HashMap<>();
            budget.put("department", department.getName());
            budget.put("allocated", department.getBudgetAllocated());
            budget.put("spent", department.getBudgetSpent());
            budget.put("remaining", department.getRemainingBudget());

            return ResponseEntity.ok(budget);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{departmentId}/employees")
    public ResponseEntity<List<Employee>> getDepartmentEmployees(@PathVariable Long departmentId) {
        try {
            Department department = departmentService.getDepartmentById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

            // Use the improved method that finds employees by both string and entity department
            List<Employee> employees = employeeRepository.findByDepartmentNameAll(department.getName());
            return ResponseEntity.ok(employees);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
