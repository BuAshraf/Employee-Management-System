import api from '../utils/api';

class AdminService {
    // Department management
    async getDepartments() {
        try {
            const response = await api.get('/departments');
            return response.data;
        } catch (error) {
            console.error('Error fetching departments:', error);
            throw error;
        }
    }

    async createDepartment(departmentData) {
        try {
            const response = await api.post('/departments', departmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating department:', error);
            throw error;
        }
    }

    async updateDepartment(id, departmentData) {
        try {
            const response = await api.put(`/departments/${id}`, departmentData);
            return response.data;
        } catch (error) {
            console.error('Error updating department:', error);
            throw error;
        }
    }

    async deleteDepartment(id) {
        try {
            const response = await api.delete(`/departments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting department:', error);
            throw error;
        }
    }

    async assignDepartmentHead(departmentId, employeeId) {
        try {
            const response = await api.put(`/departments/${departmentId}/head/${employeeId}`);
            return response.data;
        } catch (error) {
            console.error('Error assigning department head:', error);
            throw error;
        }
    }

    // Employee management
    async getEmployees(filters = {}) {
        try {
            const response = await api.get('/employees', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    async getEmployee(id) {
        try {
            const response = await api.get(`/employees/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    }

    async createEmployee(employeeData) {
        try {
            const response = await api.post('/employees', employeeData);
            return response.data;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    async updateEmployee(id, employeeData) {
        try {
            const response = await api.put(`/employees/${id}`, employeeData);
            return response.data;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    }

    async deleteEmployee(id) {
        try {
            const response = await api.delete(`/employees/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    // Salary management
    async getEmployeeSalary(id) {
        try {
            const response = await api.get(`/employees/${id}/salary`);
            return response.data;
        } catch (error) {
            console.error('Error fetching employee salary:', error);
            throw error;
        }
    }

    async updateEmployeeSalary(id, salaryData) {
        try {
            const response = await api.put(`/employees/${id}/salary`, salaryData);
            return response.data;
        } catch (error) {
            console.error('Error updating employee salary:', error);
            throw error;
        }
    }

    // Finance management
    async getSalaryOverview() {
        try {
            const response = await api.get('/finance/salary-overview');
            return response.data;
        } catch (error) {
            console.error('Error fetching salary overview:', error);
            throw error;
        }
    }

    async getBudget() {
        try {
            const response = await api.get('/finance/budget');
            return response.data;
        } catch (error) {
            console.error('Error fetching budget:', error);
            throw error;
        }
    }

    async allocateBudget(budgetData) {
        try {
            const response = await api.post('/finance/budget/allocate', budgetData);
            return response.data;
        } catch (error) {
            console.error('Error allocating budget:', error);
            throw error;
        }
    }

    async bulkUpdateSalaries(updates) {
        try {
            const response = await api.put('/finance/salaries/bulk-update', { updates });
            return response.data;
        } catch (error) {
            console.error('Error bulk updating salaries:', error);
            throw error;
        }
    }

    // Profile management
    async getCurrentUserProfile() {
        try {
            const response = await api.get('/employees/profile');
            return response.data;
        } catch (error) {
            console.error('Error fetching current user profile:', error);
            throw error;
        }
    }

    // Legacy methods for backward compatibility (these endpoints might not exist yet)
    // Role and permission management
    async updateEmployeeRole(employeeId, role) {
        try {
            // This might need to be implemented as part of updateEmployee
            const response = await api.put(`/employees/${employeeId}`, { role });
            return response.data;
        } catch (error) {
            console.error('Error updating employee role:', error);
            throw error;
        }
    }

    async updateEmployeePermissions(employeeId, permissions) {
        try {
            // This might need to be implemented as part of updateEmployee
            const response = await api.put(`/employees/${employeeId}`, { permissions });
            return response.data;
        } catch (error) {
            console.error('Error updating employee permissions:', error);
            throw error;
        }
    }

    // Permission templates (might need backend implementation)
    async getRolePermissions() {
        try {
            // This endpoint might not exist yet - using demo fallback
            const response = await api.get('/demo/roles');
            return response.data;
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            throw error;
        }
    }

    async getAvailablePermissions() {
        try {
            // This endpoint might not exist yet - fallback to hardcoded permissions
            const permissions = [
                'employee:read', 'employee:create', 'employee:write', 'employee:delete',
                'department:read', 'department:create', 'department:write', 'department:delete',
                'salary:read', 'salary:write',
                'budget:read', 'budget:write',
                'profile:read', 'profile:write'
            ];
            return permissions;
        } catch (error) {
            console.error('Error fetching available permissions:', error);
            throw error;
        }
    }

    // Analytics and reporting (need backend implementation)
    async getDepartmentStats() {
        try {
            // Fallback to demo data for now
            const departments = await this.getDepartments();
            return departments.map(dept => ({
                ...dept,
                employeeCount: dept.employeeCount || 0,
                budget: dept.budget || 0
            }));
        } catch (error) {
            console.error('Error fetching department stats:', error);
            throw error;
        }
    }

    async getEmployeeStats() {
        try {
            // Fallback to demo data for now
            const employees = await this.getEmployees();
            return {
                total: employees.length,
                active: employees.filter(emp => emp.status === 'active').length,
                byRole: employees.reduce((acc, emp) => {
                    acc[emp.role] = (acc[emp.role] || 0) + 1;
                    return acc;
                }, {})
            };
        } catch (error) {
            console.error('Error fetching employee stats:', error);
            throw error;
        }
    }

    // Bulk operations
    async bulkUpdateEmployees(updates) {
        try {
            // This would need backend implementation
            const promises = updates.map(update => 
                this.updateEmployee(update.id, update.data)
            );
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error bulk updating employees:', error);
            throw error;
        }
    }

    async exportEmployeeData(filters = {}) {
        try {
            const employees = await this.getEmployees(filters);
            // Client-side export for now
            const csvData = this.convertToCSV(employees);
            return new Blob([csvData], { type: 'text/csv' });
        } catch (error) {
            console.error('Error exporting employee data:', error);
            throw error;
        }
    }

    // Helper method for CSV export
    convertToCSV(data) {
        if (!data || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    return typeof value === 'string' && value.includes(',') 
                        ? `"${value}"` 
                        : value;
                }).join(',')
            )
        ];
        
        return csvRows.join('\n');
    }

    // System administration (might need backend implementation)
    async getSystemSettings() {
        try {
            // Fallback to default settings
            return {
                siteName: 'Employee Management System',
                currency: 'SAR',
                timezone: 'Asia/Riyadh',
                emailNotifications: true,
                maintenance: false
            };
        } catch (error) {
            console.error('Error fetching system settings:', error);
            throw error;
        }
    }

    async updateSystemSettings(settings) {
        try {
            // This would need backend implementation
            console.log('System settings updated:', settings);
            return settings;
        } catch (error) {
            console.error('Error updating system settings:', error);
            throw error;
        }
    }

    async getAuditLogs(filters = {}) {
        try {
            // This would need backend implementation
            return [];
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            throw error;
        }
    }
}

export default new AdminService();
