import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import EmployeeService from '../../services/EmployeeService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

const DashboardIcon = (props) => <FontAwesomeIcon icon={faTachometerAlt} className="text-primary" {...props} />;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 0,
    byDepartment: {},
    bySalaryRange: {},
    recentEmployees: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await EmployeeService.getAllEmployees();
      const employees = response.data;

      // Calculate dashboard metrics
      const totalEmployees = employees.length;

      // Group by department
      const byDepartment = employees.reduce((acc, emp) => {
        const dept = emp.department || 'Unknown';
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});

      // Group by salary range
      const bySalaryRange = employees.reduce((acc, emp) => {
        const salary = emp.salary || 0;
        let range;
        if (salary < 30000) range = '< 30K';
        else if (salary < 50000) range = '30K - 50K';
        else if (salary < 80000) range = '50K - 80K';
        else range = '80K+';

        acc[range] = (acc[range] || 0) + 1;
        return acc;
      }, {});

      // Get recent employees (last 5)
      const recentEmployees = employees
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setDashboardData({
        totalEmployees,
        byDepartment,
        bySalaryRange,
        recentEmployees
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <img src="/logo.ico" alt="Loading..." style={{ width: 56, height: 56, marginBottom: 16, animation: 'pulse 1.5s infinite' }} />
        <output className="spinner-border">
          <span className="visually-hidden">Loading...</span>
        </output>
        <p className="mt-2">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        <h5>Dashboard Error:</h5>
        <p>{error}</p>
        <button className="btn btn-outline-danger" onClick={loadDashboardData}>
          Retry
        </button>
      </div>
    );
  }

  const { totalEmployees, byDepartment, bySalaryRange, recentEmployees } = dashboardData;

  // Prepare data for charts
  const deptData = Object.entries(byDepartment).map(([name, value]) => ({
    name,
    value
  }));

  const salaryData = Object.entries(bySalaryRange).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
        < DashboardIcon style={{ fontSize: 28 }} className="me-2 text-primary" />
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          Dashboard
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        Overview of your organization.
      </div>


      <div className="row">
        {/* Summary Cards */}
        <div className="col-md-12 mb-4">
          <div className="row">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h5 className="card-title">Total Employees</h5>
                  <h2 className="card-text">{totalEmployees}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <h5 className="card-title">Departments</h5>
                  <h2 className="card-text">{Object.keys(byDepartment).length}</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h5 className="card-title">Avg Salary</h5>
                  <h2 className="card-text">
                    {recentEmployees.length > 0
                      ? Math.round(recentEmployees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / recentEmployees.length).toLocaleString()
                      : '0'
                    }
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <h5 className="card-title">Recent Hires</h5>
                  <h2 className="card-text">{recentEmployees.length}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Employees by Department</h5>
            </div>
            <div className="card-body">
              {deptData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deptData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {deptData.map((entry, index) => (
                        <Cell key={entry.name || index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted text-center">No department data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Salary Distribution</h5>
            </div>
            <div className="card-body">
              {salaryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted text-center">No salary data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Employees */}
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Employees</h5>
            </div>
            <div className="card-body">
              {recentEmployees.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Salary</th>
                        <th>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEmployees.map(emp => (
                        <tr key={emp.id}>
                          <td>{emp.name}</td>
                          <td>{emp.department}</td>
                          <td>{emp.position}</td>
                          <td>{emp.salary?.toLocaleString()}</td>
                          <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center">No recent employees found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;