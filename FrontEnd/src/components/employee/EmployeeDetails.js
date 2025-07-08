import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:8080/employees/${id}`);
        if (!response.ok) throw new Error('Not found');
        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError(true);
      }
    };

    if (id) fetchEmployee();
  }, [id]);


  const handleUpdate = async () => {
    const toastId = toast.loading('Updating employee...');
    try {
      const response = await fetch(`http://localhost:8080/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...employee, position: 'Updated Position' }),
      });
      if (response.ok) {
        const updated = await response.json();
        setEmployee(updated);
        toast.update(toastId, {
          render: 'Employee updated successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      toast.update(toastId, {
        render: 'Error updating employee.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting employee...');
    try {
      await fetch(`http://localhost:8080/employees/${id}`, { method: 'DELETE' });
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
    <div className="container mt-4">

      <div className="d-flex align-items-center mb-2">
        <span role="img" aria-label="Employee" style={{ fontSize: 28 }} className="me-2 text-primary">👤</span>
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          Employee Details
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        View detailed information about this employee.
      </div>
      <h4 className="mb-4">{employee.name}</h4>

      <table className="table table-bordered table-striped shadow-sm">
        <tbody>
          <tr>
            <th className="w-25">Username</th>
            <td>{employee.username}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{employee.email}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{employee.phone}</td>
          </tr>
          <tr>
            <th>Position</th>
            <td>{employee.position}</td>
          </tr>
          <tr>
            <th>Department</th>
            <td>{employee.department}</td>
          </tr>
          <tr>
            <th>Salary</th>
            <td><strong className="text-success">{employee.salary?.toLocaleString()}</strong></td>
          </tr>
          <tr>
            <th>Bonus</th>
            <td><strong className="text-success">{employee.bonus?.toLocaleString()}</strong></td>
          </tr>
          <tr>
            <th>Joining Date</th>
            <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <th>Leaving Date</th>
            <td>{employee.leavingDate ? new Date(employee.leavingDate).toLocaleDateString() : '-'}</td>
          </tr>
          <tr>
            <th>Vacation Days</th>
            <td>{employee.annualVacationDays}</td>
          </tr>
          <tr>
            <th>Created At</th>
            <td>{new Date(employee.createdAt).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Last Updated</th>
            <td>{new Date(employee.updatedAt).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="d-flex mt-4">
        <button className="btn btn-outline-primary me-2 px-4" onClick={handleUpdate}>
          Update
        </button>
        <button className="btn btn-outline-danger px-4" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>

  );
};

export default EmployeeDetails;
