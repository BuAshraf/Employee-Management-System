import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';

const UserEditIcon = (props) => <FontAwesomeIcon icon={faUserEdit} className="text-primary" {...props} />;

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    bonus: '',
    annualVacationDays: '',
    joiningDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    EmployeeService.getEmployeeById(id)
      .then(response => {
        const emp = response.data;
        // Split name into firstName and lastName if not present
        let firstName = emp.firstName || '';
        let lastName = emp.lastName || '';
        if ((!firstName || !lastName) && emp.name) {
          const parts = emp.name.trim().split(' ');
          firstName = parts[0] || '';
          lastName = parts.slice(1).join(' ') || '';
        }
        if (emp.joiningDate) {
          const date = new Date(emp.joiningDate);
          emp.joiningDate = date.toISOString().split('T')[0];
        }
        setEmployee({
          ...emp,
          firstName,
          lastName
        });
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load employee details. ' + error.message);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...employee, [name]: value };
    updated.name = `${updated.firstName || ''} ${updated.lastName || ''}`.trim();
    updated.username = (updated.firstName && updated.lastName)
      ? `${updated.firstName.toLowerCase()}.${updated.lastName.toLowerCase()}`
      : '';
    setEmployee(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating employee...');
    try {
      await EmployeeService.updateEmployee(id, employee);
      toast.update(toastId, {
        render: 'Employee updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      navigate('/employees');
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to update employee. ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (loading) return (
    <div className="text-center mt-5">
      <img src="/logo.ico" alt="Loading..." style={{ width: 56, height: 56, marginBottom: 16, animation: 'pulse 1.5s infinite' }} />
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading employee details...</p>
    </div>
  );
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
        <UserEditIcon style={{ fontSize: 28 }} className="me-2 text-primary" />
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          Edit Employee
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        Update the employee's information.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              className="form-control"
              id="position"
              name="position"
              value={employee.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              className="form-control"
              id="department"
              name="department"
              value={employee.department}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="salary">Salary</label>
            <input
              type="text"
              className="form-control"
              id="salary"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="bonus">Bonus</label>
            <input
              type="text"
              className="form-control"
              id="bonus"
              name="bonus"
              value={employee.bonus}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="annualVacationDays">Vacation Days</label>
          <input
            type="text"
            className="form-control"
            id="annualVacationDays"
            name="annualVacationDays"
            value={employee.annualVacationDays}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="joiningDate">Joining Date</label>
          <input
            type="date"
            className="form-control"
            id="joiningDate"
            name="joiningDate"
            value={employee.joiningDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-outline-primary px-4">
            Update Employee
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate('/employees')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
