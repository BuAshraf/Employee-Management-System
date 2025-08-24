// src/pages/EmployeePage.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../layout/PageHeader';
import EmployeeList from '../employee/EmployeeList';

const UsersIcon = (props) => <FontAwesomeIcon icon={faUsers} className="text-primary" {...props} />;

export default function EmployeePage() {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <UsersIcon style={{ fontSize: 32 }} className="me-3 text-primary" />
          <div>
            <h2 className="mb-1" style={{ color: '#111', fontWeight: 700, letterSpacing: '0.5px' }}>Employees</h2>
            <div className="text-muted" style={{ fontSize: '1.1rem' }}>View, edit or delete your team members below.</div>
            breadcrumbs={[
              { label: 'Home', to: '/' },
              { label: 'Employees' },              // no `to` on last crumb => current page
            ]}
            actions={[
              { label: 'Add Employee', to: '/employees/add', variant: 'primary' },
            ]}
          </div>
        </div>
      </div>

      {/* the actual table + search */}
      <EmployeeList />

    </div>

  );
}
