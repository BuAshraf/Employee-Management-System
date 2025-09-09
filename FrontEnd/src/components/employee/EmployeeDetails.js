import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeeDetails = () => {
  const { t, lang } = useI18n();
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/employees/${id}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        
        // If username is not provided by API, generate it from first and last name
        if (!data.username && data.firstName && data.lastName) {
          data.username = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`;
        }
        
        // Ensure name field exists - combine firstName and lastName if name is not provided
        if (!data.name && data.firstName && data.lastName) {
          data.name = `${data.firstName} ${data.lastName}`;
        } else if (!data.name && (data.firstName || data.lastName)) {
          data.name = data.firstName || data.lastName;
        }
        
        console.log('Employee data fetched:', data);
        setEmployee(data);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError(true);
      }
    };

    if (id) fetchEmployee();
  }, [id]);


  // removed unused handleUpdate

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting employee...');
    try {
      await fetch(`http://localhost:8080/api/employees/${id}`, { method: 'DELETE' });
      toast.update(toastId, {
        render: 'Employee deleted!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      navigate('/employees');
    } catch (err) {
      toast.update(toastId, {
        render: 'Error deleting employee.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (error) return <div className="text-danger">Employee not found.</div>;
  if (!employee) return <div>Loading employee details...</div>;

  return (
    <div
      className="container mt-4"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        background: 'rgba(255,255,255,0.98)',
        overflowY: 'auto',
        ...(lang === 'ar' ? { textAlign: 'right' } : {}),
      }}
    >



      <div className="d-flex align-items-center mb-2">
        <span role="img" aria-label={t('employee')} style={{ fontSize: 28 }} className="me-2 text-primary">👤</span>
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          {t('employeeDetails') || 'Employee Details'}
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        {t('employeeDetailsDesc') || 'View detailed information about this employee.'}
      </div>
      <h4 className="mb-4">{employee.name}</h4>
      <div className={`d-flex mb-3${lang === 'ar' ? ' justify-content-start' : ' justify-content-start'}`}>
        <Link to="/employees" className="btn btn-outline-primary mb-3">
          <i className="fas fa-user-plus me-2"></i> {t('backToList') || 'Back to List'}
        </Link>
      </div>
      <table className="table table-bordered table-striped shadow-sm">
        <tbody>
          <tr>
            <th className="w-25">{t('username') || 'Username'}</th>
            <td>{employee.username}</td>
          </tr>
          <tr>
            <th>{t('email') || 'Email'}</th>
            <td>{employee.email}</td>
          </tr>
          <tr>
            <th>{t('phone') || 'Phone'}</th>
            <td>{employee.phone}</td>
          </tr>
          <tr>
            <th>{t('position') || 'Position'}</th>
            <td>{employee.position}</td>
          </tr>
          <tr>
            <th>{t('department') || 'Department'}</th>
            <td>{employee.department}</td>
          </tr>
          <tr>
            <th>{t('salary') || 'Salary'}</th>
            <td><strong className="text-success">{employee.salary?.toLocaleString()}</strong></td>
          </tr>
          <tr>
            <th>{t('bonus') || 'Bonus'}</th>
            <td><strong className="text-success">{employee.bonus?.toLocaleString()}</strong></td>
          </tr>
          <tr>
            <th>{t('joiningDate') || 'Joining Date'}</th>
            <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>{t('leavingDate') || 'Leaving Date'}</th>
            <td>{employee.leavingDate ? new Date(employee.leavingDate).toLocaleDateString() : '-'}</td>
          </tr>
          <tr>
            <th>{t('annualVacationDays') || 'Vacation Days'}</th>
            <td>{employee.annualVacationDays}</td>
          </tr>
          <tr>
            <th>{t('createdAt') || 'Created At'}</th>
            <td>{new Date(employee.createdAt).toLocaleString()}</td>
          </tr>
          <tr>
            <th>{t('lastUpdated') || 'Last Updated'}</th>
            <td>{new Date(employee.updatedAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="d-flex mt-4">
        <Link to={`/employees/edit/${employee.id}`} className="btn btn-outline-primary me-2 px-4">
          {t('edit') || 'Edit'}
        </Link>
        <button className="btn btn-outline-danger me-2 px-4 " onClick={handleDelete}>
          {t('delete') || 'Delete'}
        </button>
      </div>
    </div>

  );
};

export default EmployeeDetails;
