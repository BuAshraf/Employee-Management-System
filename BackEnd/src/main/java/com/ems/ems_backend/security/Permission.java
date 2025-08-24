package com.ems.ems_backend.security;

public class Permission {
    // Employee permissions
    public static final String EMPLOYEE_READ = "EMPLOYEE_READ";
    public static final String EMPLOYEE_WRITE = "EMPLOYEE_WRITE";
    public static final String EMPLOYEE_DELETE = "EMPLOYEE_DELETE";
    public static final String EMPLOYEE_CREATE = "EMPLOYEE_CREATE";
    
    // Department permissions
    public static final String DEPARTMENT_READ = "DEPARTMENT_READ";
    public static final String DEPARTMENT_WRITE = "DEPARTMENT_WRITE";
    public static final String DEPARTMENT_DELETE = "DEPARTMENT_DELETE";
    public static final String DEPARTMENT_CREATE = "DEPARTMENT_CREATE";
    
    // Finance permissions
    public static final String SALARY_READ = "SALARY_READ";
    public static final String SALARY_WRITE = "SALARY_WRITE";
    public static final String BUDGET_READ = "BUDGET_READ";
    public static final String BUDGET_WRITE = "BUDGET_WRITE";
    
    // Admin permissions
    public static final String SYSTEM_CONFIG = "SYSTEM_CONFIG";
    public static final String USER_MANAGEMENT = "USER_MANAGEMENT";
    public static final String REPORTS_ACCESS = "REPORTS_ACCESS";
    public static final String AUDIT_LOGS = "AUDIT_LOGS";
    public static final String SYSTEM_MAINTENANCE = "SYSTEM_MAINTENANCE";
    public static final String BACKUP_RESTORE = "BACKUP_RESTORE";
    public static final String SECURITY_SETTINGS = "SECURITY_SETTINGS";
    
    // Profile permissions
    public static final String PROFILE_READ = "PROFILE_READ";
    public static final String PROFILE_WRITE = "PROFILE_WRITE";
}
