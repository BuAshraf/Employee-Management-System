package com.ems.ems_backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"user"}) // Fix circular reference
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name")
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name")
    private String lastName;

    @Size(max = 20)
    @Column(name = "employee_id", unique = true)
    private String employeeId;

    // Keep string department for backward compatibility
    @Size(max = 100)
    private String department;

    // Add proper department relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department departmentEntity;

    @Size(max = 100)
    private String position;

    @Size(max = 15)
    private String phone;

    @Size(max = 200)
    private String address;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    private Double salary;

    private Double bonus;

    @Column(name = "annual_vacation_days")
    private Integer annualVacationDays;

    @Size(max = 100)
    @Column(name = "email")
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        ACTIVE, INACTIVE, ON_LEAVE, IN_VACATION_DAY
    }

    // Convenience methods
    public String getFullName() {
        return firstName + " " + lastName;
    }

    // Helper method to get username from associated user or generate from name
    public String getUsername() {
        if (user != null && user.getUsername() != null) {
            return user.getUsername();
        }
        // Generate username from first name + last name if no user associated
        if (firstName != null && lastName != null) {
            return (firstName.toLowerCase() + "." + lastName.toLowerCase()).replaceAll("\\s+", "");
        }
        return null;
    }

    // Helper method to map hireDate to joiningDate for frontend compatibility
    @JsonProperty("joiningDate")
    public LocalDate getJoiningDate() {
        return hireDate;
    }

    // Helper method to get department name (supports both old string and new entity)
    public String getDepartmentName() {
        if (departmentEntity != null) {
            return departmentEntity.getName();
        }
        return department;
    }
}
