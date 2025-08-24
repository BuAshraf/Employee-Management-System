package com.ems.ems_backend.repository;

import com.ems.ems_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByUsername(String username);

    // Added missing methods for the controllers
    List<User> findByRole(User.Role role);
    long countByRole(User.Role role);

    // Fix the type mismatch by using proper join with employee table
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u JOIN u.employee e WHERE e.employeeId = :employeeId")
    Boolean existsByEmployeeId(@Param("employeeId") String employeeId);

    // Methods to filter out super admin from normal operations
    @Query("SELECT u FROM User u WHERE u.role != 'SUPER_ADMIN'")
    List<User> findAllExcludingSuperAdmin();

    @Query("SELECT u FROM User u WHERE u.role != 'SUPER_ADMIN' AND u.role = :role")
    List<User> findByRoleExcludingSuperAdmin(@Param("role") User.Role role);
}