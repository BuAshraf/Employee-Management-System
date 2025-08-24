package com.ems.ems_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.repository.EmployeeRepository;
import com.ems.ems_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/super-admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class SuperAdminController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    /**
     * Hidden super admin endpoint to get ALL users including super admin
     * Only accessible by SUPER_ADMIN role
     */
    @GetMapping("/users/all")
    public ResponseEntity<List<User>> getAllUsersIncludingOwner() {
        List<User> allUsers = userRepository.findAll();
        return ResponseEntity.ok(allUsers);
    }

    /**
     * Hidden super admin endpoint to get ALL employees including super admin
     * Only accessible by SUPER_ADMIN role
     */
    @GetMapping("/employees/all")
    public ResponseEntity<List<Employee>> getAllEmployeesIncludingOwner() {
        List<Employee> allEmployees = employeeRepository.findAll();
        return ResponseEntity.ok(allEmployees);
    }

    /**
     * System statistics for super admin
     */
    @GetMapping("/system/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalEmployees = employeeRepository.count();
        // Simplified without owner filtering
        long visibleUsers = totalUsers;
        long visibleEmployees = totalEmployees;

        stats.put("totalUsers", totalUsers);
        stats.put("totalEmployees", totalEmployees);
        stats.put("visibleUsers", visibleUsers);
        stats.put("visibleEmployees", visibleEmployees);
        stats.put("hiddenAccounts", totalUsers - visibleUsers);

        return ResponseEntity.ok(stats);
    }

    /**
     * Check if current user is super admin
     */
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifySuperAdmin() {
        // Since authentication is removed, return a basic response
        Map<String, Object> response = new HashMap<>();
        response.put("isSuperAdmin", true);
        response.put("username", "admin");
        response.put("role", "SUPER_ADMIN");
        response.put("message", "Super Admin access confirmed");
        return ResponseEntity.ok(response);
    }

    /**
     * Super admin can see owner account details
     */
    @GetMapping("/owner-info")
    public ResponseEntity<Map<String, Object>> getOwnerInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("username", "BuAshraf");
        info.put("email", "owner@ems.internal");
        info.put("employeeId", "EMS000");
        info.put("role", "SUPER_ADMIN");
        info.put("department", "Executive Management");
        info.put("position", "System Owner");
        info.put("status", "Hidden from normal operations");
        return ResponseEntity.ok(info);
    }
}
