import React, { useState, useEffect, useCallback } from 'react';
import CompanyService from '../../services/CompanyService';
import { useI18n } from '../../i18n';
import { toast } from 'react-toastify';

const AdminControlPanel = () => {
  const { t, lang } = useI18n();
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSystemData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch users, employees, and system stats
      // For now, using mock data since backend might not be ready
      setUsers([
        { id: 1, username: 'admin', email: 'admin@ems.com', role: 'ADMIN' },
        { id: 2, username: 'hr_manager', email: 'hr@ems.com', role: 'HR_MANAGER' },
      ]);

      setEmployees([
        { id: 1, firstName: 'John', lastName: 'Doe', department: 'IT', position: 'Developer' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', department: 'HR', position: 'HR Manager' },
      ]);

      setSystemStats({
        totalUsers: 5,
        totalEmployees: 25,
        activeSessions: 3,
        systemUptime: '99.9%'
      });

    } catch (error) {
      console.error('Error fetching system data:', error);
      toast.error(t('failedToLoadSystemData') || 'Failed to load system data');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchSystemData();
    CompanyService.list().then(companies => {
      // You can set company info in state or context here
      // setCompanyList(companies.content || []);
    });
  }, [fetchSystemData]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading') || 'Loading'}...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="row">
        <div className="col-12">
          <h1 className="h3 mb-4">{t('adminControlPanel') || 'Admin Control Panel'}</h1>

          {/* System Statistics */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5 className="card-title">{t('totalUsers') || 'Total Users'}</h5>
                  <h2>{systemStats.totalUsers}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5 className="card-title">{t('totalEmployees') || 'Total Employees'}</h5>
                  <h2>{systemStats.totalEmployees}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info">
                <div className="card-body">
                  <h5 className="card-title">{t('activeSessions') || 'Active Sessions'}</h5>
                  <h2>{systemStats.activeSessions}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h5 className="card-title">{t('systemUptime') || 'System Uptime'}</h5>
                  <h2>{systemStats.systemUptime}</h2>
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">{t('userManagement') || 'User Management'}</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>{t('username') || 'Username'}</th>
                          <th>{t('email') || 'Email'}</th>
                          <th>{t('role') || 'Role'}</th>
                          <th>{t('actions') || 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-1">{t('edit') || 'Edit'}</button>
                              <button className="btn btn-sm btn-outline-danger">{t('delete') || 'Delete'}</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Employee Summary */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">{t('recentEmployees') || 'Recent Employees'}</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>{t('name') || 'Name'}</th>
                          <th>{t('department') || 'Department'}</th>
                          <th>{t('position') || 'Position'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(employee => (
                          <tr key={employee.id}>
                            <td>{employee.firstName} {employee.lastName}</td>
                            <td>{employee.department}</td>
                            <td>{employee.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Actions */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">{t('systemActions') || 'System Actions'}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <button className="btn btn-outline-primary w-100 mb-2">
                        {t('backupDatabase') || 'Backup Database'}
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-outline-warning w-100 mb-2">
                        {t('systemMaintenance') || 'System Maintenance'}
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-outline-info w-100 mb-2">
                        {t('viewLogs') || 'View Logs'}
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-outline-secondary w-100 mb-2">
                        {t('systemSettings') || 'System Settings'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminControlPanel;
