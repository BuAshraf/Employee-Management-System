package com.ems.ems_backend.controller;

import com.ems.ems_backend.dto.LoginRequest;
import com.ems.ems_backend.dto.SignupRequest;
import com.ems.ems_backend.dto.AuthResponse;
import com.ems.ems_backend.dto.MessageResponse;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.repository.UserRepository;
import com.ems.ems_backend.repository.EmployeeRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder encoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // Simple authentication without JWT
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid credentials!"));
        }

        User user = userOpt.get();

        // Check password
        if (!encoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid credentials!"));
        }

        // Check if user is enabled
        if (!user.isEnabled()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Account is disabled!"));
        }

        // Update last login timestamp
        user.setLastLogin(new Timestamp(System.currentTimeMillis()));
        userRepository.save(user);

        // Get employee details if available
        Optional<Employee> employeeOpt = employeeRepository.findByUser(user);
        String employeeId = employeeOpt.map(Employee::getEmployeeId).orElse(null);
        String department = employeeOpt.map(Employee::getDepartment).orElse(null);

        // Return simple response without JWT token
        return ResponseEntity.ok(new AuthResponse(
                "authenticated",
                user.getId(),
                user.getEmail(),
                employeeId,
                department,
                user.getRole().name()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }


        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getEmail()); // Use email as username
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(User.Role.EMPLOYEE); // Default role for new registrations
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        // Create employee profile if employee details are provided
        if (signUpRequest.getName() != null || signUpRequest.getEmployeeId() != null) {
            Employee employee = new Employee();

            // Parse name if provided
            if (signUpRequest.getName() != null) {
                String[] nameParts = signUpRequest.getName().split(" ", 2);
                employee.setFirstName(nameParts[0]);
                employee.setLastName(nameParts.length > 1 ? nameParts[1] : "");
            }

            employee.setEmployeeId(signUpRequest.getEmployeeId());
            employee.setDepartment(signUpRequest.getDepartment());
            employee.setPosition("New Employee"); // Default position
            employee.setStatus(Employee.Status.ACTIVE);
            employee.setHireDate(LocalDate.now());
            employee.setUser(savedUser);

            employeeRepository.save(employee);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(new MessageResponse("User not found"));
        }

        User user = userOpt.get();
        Optional<Employee> employeeOpt = employeeRepository.findByUser(user);

        return ResponseEntity.ok(new AuthResponse(
                "authenticated",
                user.getId(),
                user.getEmail(),
                employeeOpt.map(Employee::getEmployeeId).orElse(null),
                employeeOpt.map(Employee::getDepartment).orElse(null),
                user.getRole().name()));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        return ResponseEntity.ok(new MessageResponse("User logged out successfully!"));
    }
}