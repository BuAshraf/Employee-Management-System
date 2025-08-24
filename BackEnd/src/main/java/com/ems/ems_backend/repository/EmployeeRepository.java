package com.ems.ems_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ems.ems_backend.model.Department;
import com.ems.ems_backend.model.Employee;
import com.ems.ems_backend.model.User;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmployeeId(String employeeId);

    // Support both string department and entity department
    List<Employee> findByDepartment(String department);
    List<Employee> findByDepartmentEntity(Department department);
    List<Employee> findByDepartmentEntityId(Long departmentId);

    List<Employee> findByStatus(Employee.Status status);
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findByUser(User user); // Added missing method

    @Query("SELECT e FROM Employee e WHERE e.firstName LIKE %:name% OR e.lastName LIKE %:name%")
    List<Employee> findByNameContaining(@Param("name") String name);

    // Query to fetch all employees with their associated users
    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.user")
    List<Employee> findAllWithUsers();

    // Query to fetch employee by ID with associated user
    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.user WHERE e.id = :id")
    Optional<Employee> findByIdWithUser(@Param("id") Long id);

    @Query("SELECT e FROM Employee e WHERE e.department = :department AND e.status = :status")
    List<Employee> findByDepartmentAndStatus(@Param("department") String department, @Param("status") Employee.Status status);

    // New query methods for department entity
    @Query("SELECT e FROM Employee e WHERE e.departmentEntity.name = :departmentName")
    List<Employee> findByDepartmentEntityName(@Param("departmentName") String departmentName);

    @Query("SELECT e FROM Employee e WHERE (e.department = :departmentName OR e.departmentEntity.name = :departmentName)")
    List<Employee> findByDepartmentNameAll(@Param("departmentName") String departmentName);

    // Employee ID existence checks
    boolean existsByEmployeeId(String employeeId);

    // Count methods for department statistics
    int countByDepartment(String department);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department = :departmentName OR e.departmentEntity.name = :departmentName")
    int countByDepartmentNameAll(@Param("departmentName") String departmentName);
}
