package com.ems.ems_backend.repository;

import com.ems.ems_backend.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByName(String name);
    List<Department> findByStatus(Department.Status status);
    Optional<Department> findByDepartmentHeadId(Long departmentHeadId);

    @Query("SELECT d FROM Department d WHERE d.departmentHeadId = :employeeId")
    Optional<Department> findByDepartmentHead(@Param("employeeId") Long employeeId);

    @Query("SELECT d FROM Department d WHERE d.budgetAllocated > :minBudget")
    List<Department> findByBudgetGreaterThan(@Param("minBudget") Double minBudget);

    boolean existsByName(String name);
}
