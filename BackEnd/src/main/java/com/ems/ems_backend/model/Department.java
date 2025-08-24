package com.ems.ems_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(unique = true)
    private String name;

    @Size(max = 500)
    private String description;

    @Column(name = "department_head_id")
    private Long departmentHeadId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_head_id", insertable = false, updatable = false)
    private Employee departmentHead;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employee> employees;

    @Column(name = "budget_allocated")
    private Double budgetAllocated = 0.0;

    @Column(name = "budget_spent")
    private Double budgetSpent = 0.0;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ACTIVE;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Status {
        ACTIVE, INACTIVE, UNDER_RESTRUCTURE
    }

    // Convenience methods
    public int getEmployeeCount() {
        return employees != null ? employees.size() : 0;
    }

    public Double getRemainingBudget() {
        return budgetAllocated - budgetSpent;
    }
}
