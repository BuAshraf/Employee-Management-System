import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';

const UserEditIcon = (props) => <FontAwesomeIcon icon={faUserEdit} className="text-primary" {...props} />;

const UpdateEmployee = () => {
  const { t, lang } = useI18n();
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
    joiningDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        console.log('Loading employee with ID:', id);
        const response = await EmployeeService.getEmployeeById(id);
        const emp = response.data;
        console.log('Loaded employee data:', emp);
        
        // Split name into firstName and lastName if not present
        let firstName = emp.firstName || '';
        let lastName = emp.lastName || '';
        if ((!firstName || !lastName) && emp.name) {
          const parts = emp.name.trim().split(' ');
          firstName = parts[0] || '';
          lastName = parts.slice(1).join(' ') || '';
        }
        
        // Format joining date for input field
        if (emp.hireDate) {
          const date = new Date(emp.hireDate);
          emp.joiningDate = date.toISOString().split('T')[0];
        } else if (emp.joiningDate) {
          const date = new Date(emp.joiningDate);
          emp.joiningDate = date.toISOString().split('T')[0];
        }
        
        // Ensure all required fields have default values
        const employeeData = {
          firstName,
          lastName,
          name: emp.name || `${firstName} ${lastName}`.trim(),
          email: emp.email || '',
          phone: emp.phone || '',
          position: emp.position || '',
          department: emp.department || '',
          salary: emp.salary || '',
          bonus: emp.bonus || '',
          annualVacationDays: emp.annualVacationDays || '',
          joiningDate: emp.joiningDate || '',
          hireDate: emp.hireDate || emp.joiningDate || '', // Support both field names
          username: emp.username || (firstName && lastName ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}` : ''),
          // Preserve other fields that might exist, but do not override processed firstName/lastName
          ...emp,
        };
        
        console.log('Setting employee data:', employeeData);
        setEmployee(employeeData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading employee:', error);
        setError('Failed to load employee details. ' + (error.response?.data?.message || error.message));
        setLoading(false);
      }
    };

    if (id) {
      loadEmployee();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...employee, [name]: value };
    
    // Always update the full name when first or last name changes
    if (name === 'firstName' || name === 'lastName') {
      updated.name = `${updated.firstName || ''} ${updated.lastName || ''}`.trim();
      
      // Update username based on first and last name
      if (updated.firstName && updated.lastName) {
        updated.username = `${updated.firstName.toLowerCase()}.${updated.lastName.toLowerCase()}`;
      }
    }
    
    // Convert salary and bonus to numbers
    if (name === 'salary' || name === 'bonus') {
      updated[name] = value === '' ? '' : value;
    }
    
    // Convert annualVacationDays to number
    if (name === 'annualVacationDays') {
      updated[name] = value === '' ? '' : parseInt(value) || '';
    }
    
    console.log('Updated employee data:', updated);
    setEmployee(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (saving) return; // Prevent double submission
    
    setSaving(true);
    const toastId = toast.loading('Updating employee...');
    
    try {
      // Ensure we have the complete employee object with proper field mapping
      const updateData = {
        ...employee,
        name: `${employee.firstName || ''} ${employee.lastName || ''}`.trim(),
        username: (employee.firstName && employee.lastName)
          ? `${employee.firstName.toLowerCase()}.${employee.lastName.toLowerCase()}`
          : employee.username || '',
        // Map frontend fields to backend fields
        hireDate: employee.joiningDate || employee.hireDate || null,
        // Ensure numeric fields are properly converted
        salary: employee.salary ? parseFloat(employee.salary) : 0,
        bonus: employee.bonus ? parseFloat(employee.bonus) : 0,
        annualVacationDays: employee.annualVacationDays ? parseInt(employee.annualVacationDays, 10) : 0,
        // Remove joiningDate since backend uses hireDate
        joiningDate: undefined
      };

      console.log('Updating employee with data:', updateData);
      
      const response = await EmployeeService.updateEmployee(id, updateData);
      console.log('Update response:', response);
      
      toast.update(toastId, {
        render: 'Employee updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      
      // Navigate back to employees list
      navigate('/employees');
    } catch (error) {
      console.error('Update error:', error);
      toast.update(toastId, {
        render: `Failed to update employee. ${error.response?.data?.message || error.message}`,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
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
    <div className="container mt-4" dir={lang === 'ar' ? 'rtl' : 'ltr'} style={lang === 'ar' ? { textAlign: 'right' } : {}}>
      <div className="d-flex align-items-center mb-2">
        <UserEditIcon style={{ fontSize: 28 }} className="me-2 text-primary" />
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          {t('editEmployee') || 'Edit Employee'}
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        {t('editEmployeeDesc') || "Update the employee's information."}
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
            <label htmlFor="email">{t('email') || 'Email'}</label>
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
            <label htmlFor="bonus">{t('bonus') || 'Bonus'}</label>
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
          <label htmlFor="annualVacationDays">{t('annualVacationDays') || 'Vacation Days'}</label>
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
          <label htmlFor="joiningDate">{t('joiningDate') || 'Joining Date'}</label>
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
          <button 
            type="submit" 
            className="btn btn-outline-primary px-4"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving...
              </>
            ) : (
              t('updateEmployee') || 'Update Employee'
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => navigate('/employees')}
            disabled={saving}
          >
            {t('cancel') || 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployee;
