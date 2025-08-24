import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { toast } from 'react-toastify';




const AddEmployee = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    address: '',
    hireDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
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
        autoClose: 3000,
      });
      navigate('/employees');
    } catch (error) {
      toast.update(toastId, {
        render: `Failed to create employee. ${error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="ms-auto d-flex justify-content-end mb-3">
        <Link to="/employees" className="btn btn-outline-primary mb-3">
          <i className="fas fa-user-plus me-2"></i> {t('backToList') || 'Back to List'}
        </Link>
      </div>

      <div className="d-flex align-items-center mb-2">
        <span style={{ fontSize: 28, color: '#007bff' }} className="me-2" aria-label={t('addEmployee')} title={t('addEmployee')}>👤</span>
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          {t('addNewEmployee') || 'Add New Employee'}
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        {t('addEmployeeDesc') || 'Enter the details of the new employee.'}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="firstName">{t('firstName') || 'First Name'}</label>
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
            <label htmlFor="lastName">{t('lastName') || 'Last Name'}</label>
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
            <label htmlFor="phone">{t('phone') || 'Phone'}</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={employee.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="address">{t('address') || 'Address'}</label>
            <input
              type="text"
              className="form-control"
              id="address"
              name="address"
              value={employee.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="position">{t('position') || 'Position'}</label>
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
            <label htmlFor="department">{t('department') || 'Department'}</label>
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
            <label htmlFor="salary">{t('salary') || 'Salary'}</label>
            <input
              type="number"
              className="form-control"
              id="salary"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="hireDate">{t('hireDate') || 'Hire Date'}</label>
            <input
              type="date"
              className="form-control"
              id="hireDate"
              name="hireDate"
              value={employee.hireDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-outline-primary px-4">
            {t('saveEmployee') || 'Save Employee'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate('/employees')}
          >
            {t('cancel') || 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
