package com.ems.ems_backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import org.springframework.web.multipart.MultipartFile;

import com.ems.ems_backend.model.Department;
import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.repository.DepartmentRepository;
import com.ems.ems_backend.repository.EmployeeRepository;
import com.ems.ems_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/category")
    public ResponseEntity<?> getCategories() {
        try {
            List<Department> departments = departmentRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", departments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/add_category")
    public ResponseEntity<?> addCategory(@RequestBody Map<String, String> request) {
        try {
            String categoryName = request.get("category");
            Department department = new Department();
            department.setName(categoryName);
            department.setDescription("Department: " + categoryName);
            departmentRepository.save(department);

            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/add_employee")
    public ResponseEntity<?> addEmployee(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("address") String address,
            @RequestParam("salary") Double salary,
            @RequestParam("category_id") Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                Map<String, Object> response = new HashMap<>();
                response.put("Status", false);
                response.put("Error", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }

            // Create User
            User user = new User();
            user.setEmail(email);
            user.setUsername(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(User.Role.EMPLOYEE);
            user.setEnabled(true);
            User savedUser = userRepository.save(user);

            // Create Employee
            Employee employee = new Employee();
            String[] nameParts = name.split(" ", 2);
            employee.setFirstName(nameParts[0]);
            employee.setLastName(nameParts.length > 1 ? nameParts[1] : "");
            // Remove employee.setEmail(email) - email is stored in User entity
            employee.setAddress(address);
            employee.setSalary(salary);
            employee.setHireDate(LocalDate.now());
            employee.setStatus(Employee.Status.ACTIVE);
            employee.setUser(savedUser);

            // Handle department
            Optional<Department> deptOpt = departmentRepository.findById(categoryId);
            if (deptOpt.isPresent()) {
                employee.setDepartmentEntity(deptOpt.get());
                employee.setDepartment(deptOpt.get().getName());
            }

            // Handle image upload
            if (image != null && !image.isEmpty()) {
                saveImage(image);
                // Remove employee.setProfilePicture(fileName) - field doesn't exist
                // TODO: Add profilePicture field to Employee model if needed
            }

            employeeRepository.save(employee);

            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/employee")
    public ResponseEntity<?> getAllEmployees() {
        try {
            List<Employee> employees = employeeRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", employees);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable Long id) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findById(id);
            if (employeeOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("Status", true);
                response.put("Result", List.of(employeeOpt.get()));
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("Status", false);
                response.put("Error", "Employee not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/edit_employee/{id}")
    public ResponseEntity<?> editEmployee(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findById(id);
            if (employeeOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("Status", false);
                response.put("Error", "Employee not found");
                return ResponseEntity.badRequest().body(response);
            }

            Employee employee = employeeOpt.get();
            String name = (String) request.get("name");
            if (name != null) {
                String[] nameParts = name.split(" ", 2);
                employee.setFirstName(nameParts[0]);
                employee.setLastName(nameParts.length > 1 ? nameParts[1] : "");
            }

            if (request.get("email") != null) {
                // Remove employee.setEmail() - Employee doesn't have email field
                // Update the associated User's email instead
                if (employee.getUser() != null) {
                    employee.getUser().setEmail((String) request.get("email"));
                    userRepository.save(employee.getUser());
                }
            }

            if (request.get("salary") != null) {
                employee.setSalary(Double.valueOf(request.get("salary").toString()));
            }

            if (request.get("address") != null) {
                employee.setAddress((String) request.get("address"));
            }

            if (request.get("category_id") != null) {
                Long categoryId = Long.valueOf(request.get("category_id").toString());
                Optional<Department> deptOpt = departmentRepository.findById(categoryId);
                if (deptOpt.isPresent()) {
                    employee.setDepartmentEntity(deptOpt.get());
                    employee.setDepartment(deptOpt.get().getName());
                }
            }

            employeeRepository.save(employee);

            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", employee);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/delete_employee/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            Optional<Employee> employeeOpt = employeeRepository.findById(id);
            if (employeeOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("Status", false);
                response.put("Error", "Employee not found");
                return ResponseEntity.badRequest().body(response);
            }

            Employee employee = employeeOpt.get();
            if (employee.getUser() != null) {
                userRepository.delete(employee.getUser());
            }
            employeeRepository.delete(employee);

            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", "Employee deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/admin_count")
    public ResponseEntity<?> getAdminCount() {
        try {
            long adminCount = userRepository.countByRole(User.Role.ADMIN);
            Map<String, Object> result = new HashMap<>();
            result.put("admin", adminCount);

            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", List.of(result));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/employee_count")
    public ResponseEntity<?> getEmployeeCount() {
        try {
            long employeeCount = employeeRepository.count();
            Map<String, Object> result = new HashMap<>();
            result.put("employee", employeeCount);

            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", List.of(result));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/salary_count")
    public ResponseEntity<?> getSalarySum() {
        try {
            List<Employee> employees = employeeRepository.findAll();
            double totalSalary = employees.stream()
                    .mapToDouble(emp -> emp.getSalary() != null ? emp.getSalary() : 0.0)
                    .sum();

            Map<String, Object> result = new HashMap<>();
            result.put("salaryOFEmp", totalSalary);

            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", List.of(result));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/admin_records")
    public ResponseEntity<?> getAdminRecords() {
        try {
            List<User> admins = userRepository.findByRole(User.Role.ADMIN);
            Map<String, Object> response = new HashMap<>();
            response.put("Status", true);
            response.put("Result", admins);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("Status", false);
            response.put("Error", "Query Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Authentication endpoints removed

    private String saveImage(MultipartFile image) throws IOException {
        if (image.isEmpty()) {
            return null;
        }

        String fileName = "image_" + System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get("public/images");

        // Create directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath);

        return fileName;
    }
}
