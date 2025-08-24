package com.ems.ems_backend.model;

import com.ems.ems_backend.security.Permission;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"employee"}) // Fix circular reference
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(unique = true)
    private String username;

    @NotBlank
    @Size(max = 100)
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(max = 120)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role = Role.EMPLOYEE;

    @Column(name = "account_non_expired")
    private boolean accountNonExpired = true;

    @Column(name = "account_non_locked")
    private boolean accountNonLocked = true;

    @Column(name = "credentials_non_expired")
    private boolean credentialsNonExpired = true;

    private boolean enabled = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "last_login")
    private Timestamp lastLogin;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Employee employee;

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();

        // Add role authority
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));

        // Add permissions based on role
        authorities.addAll(getPermissionsForRole(role));

        return authorities;
    }

    private List<GrantedAuthority> getPermissionsForRole(Role role) {
        List<GrantedAuthority> permissions = new ArrayList<>();

        switch (role) {
            case SUPER_ADMIN:
                // Super admin has all permissions plus hidden access
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_DELETE));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_CREATE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_DELETE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_CREATE));
                permissions.add(new SimpleGrantedAuthority(Permission.SALARY_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.SALARY_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.BUDGET_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.BUDGET_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.SYSTEM_CONFIG));
                permissions.add(new SimpleGrantedAuthority(Permission.USER_MANAGEMENT));
                permissions.add(new SimpleGrantedAuthority(Permission.REPORTS_ACCESS));
                permissions.add(new SimpleGrantedAuthority(Permission.AUDIT_LOGS));
                permissions.add(new SimpleGrantedAuthority(Permission.SYSTEM_MAINTENANCE));
                permissions.add(new SimpleGrantedAuthority(Permission.BACKUP_RESTORE));
                permissions.add(new SimpleGrantedAuthority(Permission.SECURITY_SETTINGS));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                permissions.add(new SimpleGrantedAuthority("SUPER_ADMIN_ACCESS"));
                break;

            case ADMIN:
                // Admin has all permissions
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_DELETE));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_CREATE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_DELETE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_CREATE));
                permissions.add(new SimpleGrantedAuthority(Permission.SALARY_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.SALARY_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.BUDGET_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.BUDGET_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.SYSTEM_CONFIG));
                permissions.add(new SimpleGrantedAuthority(Permission.USER_MANAGEMENT));
                permissions.add(new SimpleGrantedAuthority(Permission.REPORTS_ACCESS));
                permissions.add(new SimpleGrantedAuthority(Permission.AUDIT_LOGS));
                permissions.add(new SimpleGrantedAuthority(Permission.SYSTEM_MAINTENANCE));
                permissions.add(new SimpleGrantedAuthority(Permission.BACKUP_RESTORE));
                permissions.add(new SimpleGrantedAuthority(Permission.SECURITY_SETTINGS));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                break;

            case HR:
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_CREATE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.USER_MANAGEMENT));
                permissions.add(new SimpleGrantedAuthority(Permission.REPORTS_ACCESS));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                break;

            case FINANCE_MANAGER:
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.SALARY_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.SALARY_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.BUDGET_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.BUDGET_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.REPORTS_ACCESS));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                break;

            case DEPARTMENT_HEAD:
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_WRITE));
                permissions.add(new SimpleGrantedAuthority(Permission.REPORTS_ACCESS));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                break;

            case MANAGER:
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.DEPARTMENT_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.REPORTS_ACCESS));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                break;

            case IT_SUPPORT:
                permissions.add(new SimpleGrantedAuthority(Permission.EMPLOYEE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.SYSTEM_MAINTENANCE));
                permissions.add(new SimpleGrantedAuthority(Permission.BACKUP_RESTORE));
                permissions.add(new SimpleGrantedAuthority(Permission.SECURITY_SETTINGS));
                permissions.add(new SimpleGrantedAuthority(Permission.AUDIT_LOGS));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                break;

            case EMPLOYEE:
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_READ));
                permissions.add(new SimpleGrantedAuthority(Permission.PROFILE_WRITE));
                break;
        }

        return permissions;
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public enum Role {
        SUPER_ADMIN,     // Hidden super admin with all access
        ADMIN,
        HR,
        MANAGER,
        EMPLOYEE,
        DEPARTMENT_HEAD,  // Can manage specific department
        FINANCE_MANAGER,  // Access to salary/budget data
        IT_SUPPORT       // System maintenance access
    }
}