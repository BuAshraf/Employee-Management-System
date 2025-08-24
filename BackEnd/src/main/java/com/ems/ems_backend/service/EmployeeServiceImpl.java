package com.ems.ems_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.ems.ems_backend.exception.DuplicateEmployeeException;
import com.ems.ems_backend.exception.EmployeeNotFoundException;
import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public Employee create(Employee employee) {
        // Validate employee ID uniqueness if provided
        if (employee.getEmployeeId() != null &&
                !employee.getEmployeeId().trim().isEmpty()) {

            Optional<Employee> existingEmployee = employeeRepository.findByEmployeeId(employee.getEmployeeId());
            if (existingEmployee.isPresent()) {
                throw new DuplicateEmployeeException(
                        "Employee ID '" + employee.getEmployeeId() + "' is already in use."
                );
            }
        } else {
            // Generate employee ID if not provided
            employee.setEmployeeId(generateEmployeeId(employee));
        }

        return employeeRepository.save(employee);
    }

    @Override
    public Employee update(Long id, Employee employeeDetails) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee with ID " + id + " not found"));

        // Validate employee ID uniqueness if changed
        if (employeeDetails.getEmployeeId() != null &&
                !employeeDetails.getEmployeeId().equals(existingEmployee.getEmployeeId())) {

            Optional<Employee> duplicateEmployee = employeeRepository.findByEmployeeId(employeeDetails.getEmployeeId());
            if (duplicateEmployee.isPresent()) {
                throw new DuplicateEmployeeException(
                        "Employee ID '" + employeeDetails.getEmployeeId() + "' is already in use."
                );
            }
        }

        // Update fields
        existingEmployee.setFirstName(employeeDetails.getFirstName());
        existingEmployee.setLastName(employeeDetails.getLastName());
        existingEmployee.setEmployeeId(employeeDetails.getEmployeeId());
        existingEmployee.setDepartment(employeeDetails.getDepartment());
        existingEmployee.setPosition(employeeDetails.getPosition());
        existingEmployee.setPhone(employeeDetails.getPhone());
        existingEmployee.setAddress(employeeDetails.getAddress());
        existingEmployee.setSalary(employeeDetails.getSalary());
        existingEmployee.setBonus(employeeDetails.getBonus());
        existingEmployee.setAnnualVacationDays(employeeDetails.getAnnualVacationDays());
        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setHireDate(employeeDetails.getHireDate());
        existingEmployee.setStatus(employeeDetails.getStatus());
        existingEmployee.setBirthDate(employeeDetails.getBirthDate());

        return employeeRepository.save(existingEmployee);
    }

    @Override
    public Employee updateStatus(Long id, Employee.Status status) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee with ID " + id + " not found"));
        
        existingEmployee.setStatus(status);
        return employeeRepository.save(existingEmployee);
    }

    @Override
    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new EmployeeNotFoundException("Employee with ID " + id + " not found");
        }
        employeeRepository.deleteById(id);
    }

    @Override
    public Employee getById(Long id) {
        return employeeRepository.findByIdWithUser(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee with ID " + id + " not found"));
    }

    @Override
    public List<Employee> getAll() {
        return employeeRepository.findAllWithUsers();
    }

    @Override
    public List<Employee> search(String query) {
        return employeeRepository.findByNameContaining(query);
    }

    @Override
    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartmentNameAll(department);
    }

    @Override
    public List<Employee> getEmployeesByStatus(Employee.Status status) {
        return employeeRepository.findByStatus(status);
    }

    @Override
    public Optional<Employee> getEmployeeByUserId(Long userId) {
        return employeeRepository.findByUserId(userId);
    }

    @Override
    public boolean isCurrentUser(Long employeeId, Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return false;
        }

        User currentUser = (User) authentication.getPrincipal();
        Optional<Employee> employee = employeeRepository.findById(employeeId);

        if (employee.isPresent() && employee.get().getUser() != null) {
            return employee.get().getUser().getId().equals(currentUser.getId());
        }

        return false;
    }

    // Helper method for generating employee IDs
    private String generateEmployeeId(Employee employee) {
        String prefix = "EMP";
        String departmentCode = "";

        if (employee.getDepartment() != null) {
            departmentCode = employee.getDepartment().substring(0,
                    Math.min(3, employee.getDepartment().length())).toUpperCase();
        }

        // Get next sequence number
        long count = employeeRepository.count() + 1;

        return prefix + departmentCode + String.format("%03d", count);
    }

    // Helper method for generating usernames from first name + last name
    private String generateUsername(Employee employee) {
        if (employee.getFirstName() != null && employee.getLastName() != null) {
            String username = (employee.getFirstName().toLowerCase() + "." + employee.getLastName().toLowerCase())
                    .replaceAll("\\s+", "")  // Remove any spaces
                    .replaceAll("[^a-zA-Z0-9.]", ""); // Remove special characters except dots
            
            // Ensure uniqueness by adding number if needed
            String baseUsername = username;
            int counter = 1;
            while (userExists(username)) {
                username = baseUsername + counter;
                counter++;
            }
            
            return username;
        }
        return null;
    }

    // Helper method to check if username exists (would need User repository for real implementation)
    private boolean userExists(String username) {
        // For now, return false. In a real implementation, you'd check the User repository
        // return userRepository.existsByUsername(username);
        return false;
    }
}
