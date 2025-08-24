package com.ems.ems_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;

@Configuration
public class RoleHierarchyConfig {

    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        String hierarchy = """
            ROLE_ADMIN > ROLE_HR
            ROLE_ADMIN > ROLE_FINANCE_MANAGER
            ROLE_ADMIN > ROLE_IT_SUPPORT
            ROLE_HR > ROLE_MANAGER
            ROLE_HR > ROLE_DEPARTMENT_HEAD
            ROLE_FINANCE_MANAGER > ROLE_MANAGER
            ROLE_MANAGER > ROLE_EMPLOYEE
            ROLE_DEPARTMENT_HEAD > ROLE_EMPLOYEE
            ROLE_IT_SUPPORT > ROLE_EMPLOYEE
            """;
        roleHierarchy.setHierarchy(hierarchy);
        return roleHierarchy;
    }
}
