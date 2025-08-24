package com.ems.ems_backend.service;

import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.repository.EmployeeRepository;
import com.ems.ems_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OwnerFilterService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    // Hidden owner identifiers
    private static final String OWNER_USERNAME = "BuAshraf";
    private static final String OWNER_EMAIL = "owner@ems.internal";
    private static final String OWNER_EMPLOYEE_ID = "EMS000";

    /**
     * Filter out owner account from user lists
     */
    public List<User> filterOwnerFromUsers(List<User> users) {
        return users.stream()
                .filter(user -> !isOwnerUser(user))
                .collect(Collectors.toList());
    }

    /**
     * Filter out owner account from employee lists
     */
    public List<Employee> filterOwnerFromEmployees(List<Employee> employees) {
        return employees.stream()
                .filter(employee -> !isOwnerEmployee(employee))
                .collect(Collectors.toList());
    }

    /**
     * Get all employees excluding the super admin owner
     */
    public List<Employee> getAllEmployeesExcludingOwner() {
        List<Employee> allEmployees = employeeRepository.findAll();
        return allEmployees.stream()
                .filter(employee -> !isOwnerEmployee(employee))
                .collect(Collectors.toList());
    }

    /**
     * Get all users excluding the super admin owner
     */
    public List<User> getAllUsersExcludingOwner() {
        return userRepository.findAllExcludingSuperAdmin();
    }

    /**
     * Check if an employee is the owner (super admin)
     */
    public boolean isOwnerEmployee(Employee employee) {
        if (employee == null) return false;

        // Check by employee ID
        if ("EMS000".equals(employee.getEmployeeId())) {
            return true;
        }

        // Check by user role if user exists
        if (employee.getUser() != null) {
            return employee.getUser().getRole() == User.Role.SUPER_ADMIN;
        }

        return false;
    }

    /**
     * Check if a user is the owner (super admin)
     */
    public boolean isOwnerUser(User user) {
        if (user == null) return false;
        return user.getRole() == User.Role.SUPER_ADMIN;
    }

    /**
     * Check if current user has super admin access
     */
    public boolean hasOwnerAccess(User user) {
        return user != null && user.getRole() == User.Role.SUPER_ADMIN;
    }

    /**
     * Get filtered employee count for statistics (excluding owner)
     */
    public long getEmployeeCountExcludingOwner() {
        return getAllEmployeesExcludingOwner().size();
    }

    /**
     * Get employees by department excluding owner
     */
    public List<Employee> getEmployeesByDepartmentExcludingOwner(String department) {
        return employeeRepository.findByDepartment(department).stream()
                .filter(employee -> !isOwnerEmployee(employee))
                .collect(Collectors.toList());
    }

    /**
     * Check if user is the owner account
     */
    public boolean isCurrentUserOwner(String username) {
        return OWNER_USERNAME.equals(username);
    }
}
