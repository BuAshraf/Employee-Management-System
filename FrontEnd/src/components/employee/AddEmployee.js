import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { toast } from 'react-toastify';




const AddEmployee = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    bonus: '',
    annualVacationDays: '',
    joiningDate: ''
  });

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

    const toastId = toast.loading('Creating employee...');
    try {
      await EmployeeService.createEmployee(employee);
      toast.update(toastId, {
        render: 'Employee created successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
      navigate('/employees');
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to create employee. ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
        <span style={{ fontSize: 28, color: '#007bff' }} className="me-2" aria-label="Add Employee" title="Add Employee">👤</span>
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          Add New Employee
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        Enter the details of the new employee.
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
            Save Employee
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

export default AddEmployee;
