import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import emailjs from 'emailjs-com';
import PageHeader from '../layout/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

// Helper to get admin email from settings (localStorage)
function getAdminEmail() {
  const settings = localStorage.getItem('ems_settings');
  if (settings) {
    try {
      return JSON.parse(settings).companyEmail || 'employeemanagementsysteme@gmail.com';
    } catch {
      return 'employeemanagementsysteme@gmail.com';
    }
  }
  return 'employeemanagementsysteme@gmail.com';
}

const ChartBarIcon = (props) => <FontAwesomeIcon icon={faChartBar} className="text-primary" {...props} />;

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('department');
  // Popup state for report sent
  const [showReportPopup, setShowReportPopup] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await EmployeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDepartmentReport = () => {
    const deptStats = employees.reduce((acc, emp) => {
      const dept = emp.department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { 
          department: dept, 
          count: 0, 
          totalSalary: 0, 
          avgSalary: 0 
        };
      }
      acc[dept].count++;
      acc[dept].totalSalary += parseFloat(emp.salary) || 0;
      acc[dept].avgSalary = acc[dept].totalSalary / acc[dept].count;
      return acc;
    }, {});

    return Object.values(deptStats);
  };

  const generateSalaryReport = () => {
    const salaryRanges = {
      '< $30K': { range: '< $30K', count: 0, totalBonus: 0 },
      '$30K - $50K': { range: '$30K - $50K', count: 0, totalBonus: 0 },
      '$50K - $70K': { range: '$50K - $70K', count: 0, totalBonus: 0 },
      '$70K - $100K': { range: '$70K - $100K', count: 0, totalBonus: 0 },
      '> $100K': { range: '> $100K', count: 0, totalBonus: 0 }
    };

    employees.forEach(emp => {
      const salary = parseFloat(emp.salary) || 0;
      const bonus = parseFloat(emp.bonus) || 0;
      
      if (salary < 30000) {
        salaryRanges['< $30K'].count++;
        salaryRanges['< $30K'].totalBonus += bonus;
      } else if (salary < 50000) {
        salaryRanges['$30K - $50K'].count++;
        salaryRanges['$30K - $50K'].totalBonus += bonus;
      } else if (salary < 70000) {
        salaryRanges['$50K - $70K'].count++;
        salaryRanges['$50K - $70K'].totalBonus += bonus;
      } else if (salary < 100000) {
        salaryRanges['$70K - $100K'].count++;
        salaryRanges['$70K - $100K'].totalBonus += bonus;
      } else {
        salaryRanges['> $100K'].count++;
        salaryRanges['> $100K'].totalBonus += bonus;
      }
    });

    return Object.values(salaryRanges);
  };

  const generateJoiningTrendReport = () => {
    const monthlyJoins = employees.reduce((acc, emp) => {
      if (emp.joiningDate) {
        const date = new Date(emp.joiningDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        acc[monthYear] = (acc[monthYear] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(monthlyJoins)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  };

  const departmentData = generateDepartmentReport();
  const salaryData = generateSalaryReport();
  const joiningTrendData = generateJoiningTrendReport();

  if (loading) return <div className="text-center mt-5">Loading reports...</div>;

  // Email report to admin
  const handleSendReport = async () => {
    const adminEmail = getAdminEmail();
    try {
      await emailjs.send(
        'service_of80oqi',
        'template_m6z7hue',
        {
          from_name: 'EMS Reports',
          message: `Automated report sent from EMS Reports page.`,
          screenshot: '',
          email: adminEmail
        },
        'LD4XBjznzfQqThmz2'
      );
      setShowReportPopup(true);
      setTimeout(() => setShowReportPopup(false), 3000);
    } catch (err) {
      alert('Failed to send report: ' + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <PageHeader
        icon={ChartBarIcon}
        title="Reports & Analytics"
        subtitle="Comprehensive insights into your workforce"
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-muted">Comprehensive insights into your workforce</p>
        </div>
        <div>
          <button className="btn btn-outline-success px-4 me-2" onClick={handleSendReport}>
            <i className="fas fa-envelope me-2"></i>Email Report to EMS Support Team
          </button>
          <Link to="/" className="btn btn-outline-primary px-4 me-2">
            <i className="fas fa-arrow-left me-2"></i>Back to Home
          </Link>
        </div>
        {/* Report sent popup */}
        {showReportPopup && (
          <div style={{
            position: 'fixed',
            top: 80,
            right: 30,
            background: '#e6f7e6',
            color: '#218838',
            border: '1.5px solid #b2dfb2',
            borderRadius: 8,
            padding: '14px 28px',
            fontWeight: 600,
            fontSize: 18,
            zIndex: 3000,
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)'
          }}>
            Report sent to EMS Support Team 😁👍.
          </div>
        )}
      </div>

      {/* Report Type Selector */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-outline-primary px-4 me-2${selectedReport === 'department' ? ' active' : ''}`}
              style={selectedReport === 'department' ? { backgroundColor: '#0d6efd', color: '#fff', borderColor: '#0d6efd' } : {}}
              onClick={() => setSelectedReport('department')}
            >
              Department Analysis
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary px-4 me-2${selectedReport === 'salary' ? ' active' : ''}`}
              style={selectedReport === 'salary' ? { backgroundColor: '#0d6efd', color: '#fff', borderColor: '#0d6efd' } : {}}
              onClick={() => setSelectedReport('salary')}
            >
              Salary Distribution
            </button>
            <button
              type="button"
              className={`btn btn-outline-primary px-4 me-2${selectedReport === 'trend' ? ' active' : ''}`}
              style={selectedReport === 'trend' ? { backgroundColor: '#0d6efd', color: '#fff', borderColor: '#0d6efd' } : {}}
              onClick={() => setSelectedReport('trend')}
            >
              Hiring Trends
            </button>
          </div>
        </div>
      </div>

      {/* Department Report */}
      {selectedReport === 'department' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5>Department Employee Count</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Employee Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Department Summary</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Count</th>
                        <th>Avg Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentData.map((dept, index) => (
                        <tr key={index}>
                          <td>{dept.department}</td>
                          <td>{dept.count}</td>
                          <td>${dept.avgSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary Report */}
      {selectedReport === 'salary' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5>Salary Range Distribution</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Employee Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Salary Statistics</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Range</th>
                        <th>Count</th>
                        <th>Total Bonus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salaryData.map((range, index) => (
                        <tr key={index}>
                          <td>{range.range}</td>
                          <td>{range.count}</td>
                          <td>${range.totalBonus.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiring Trend Report */}
      {selectedReport === 'trend' && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5>Monthly Hiring Trends</h5>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={joiningTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="New Hires" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="card mt-4">
        <div className="card-header">
          <h5>Export Options</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <button className="btn btn-outline-success px-4 me-2 w-100 mb-2">
                <i className="fas fa-file-excel me-2"></i>Export to Excel
              </button>
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-danger px-4 me-2 w-100 mb-2">
                <i className="fas fa-file-pdf me-2"></i>Export to PDF
              </button>
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-primary px-4 me-2 w-100 mb-2">
                <i className="fas fa-file-csv me-2"></i>Export to CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;