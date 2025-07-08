import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import SearchEmployee from './SearchEmployee';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const UsersIcon = (props) => <FontAwesomeIcon icon={faUsers} className="text-primary" {...props} />;


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all employees
  const loadEmployees = async () => {
    try {
      const res = await EmployeeService.getAllEmployees();
      setEmployees(res.data);
    } catch (err) {
      setError(`Failed to load employees: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Delete
  const deleteEmployee = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await EmployeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError(`Failed to delete: ${err.message}`);
    }
  };

  // Search & clear callbacks
  const handleSearch = results => setEmployees(results);
  const handleClearSearch = () => { setLoading(true); setError(null); loadEmployees(); };

  if (loading) return <div className="text-center mt-5">Loading…</div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
              <UsersIcon style={{ fontSize: 28 }} className="me-2 text-primary" />
              <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
                Employee Management
              </span>
            </div>
            <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
              All Employees
            </div>
            <div className="mb-4" style={{ fontSize: '0.9rem', color: '#444' }}>
              View, edit or delete your team members below.
            </div>
            <div className="ms-auto d-flex justify-content-end mb-3">
              <Link to="/employees/add" className="btn btn-outline-success px-4">
                <i className="fas fa-user-plus me-2"></i> Add Employee
              </Link>
            </div>

      <SearchEmployee onSearch={handleSearch} onClear={handleClearSearch} />


      {employees.length === 0 ? (
        <div className="alert alert-info">No employees found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered-striped shadow-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id}>
                  <td>{idx + 1}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.position}</td>
                  <td>{emp.department}</td>
                  <td>
                    <Link
                      to={`/employees/view/${emp.id}`}
                      className="btn btn-outline-info px-4 me-2"
                    >
                      View
                    </Link>
                    <Link
                      to={`/employees/edit/${emp.id}`}
                      className="btn btn-outline-primary px-4 me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger px-4"
                      onClick={() => deleteEmployee(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
