// src/components/pages/Home.js

import React, {  useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const UsersIcon = (props) => <FontAwesomeIcon icon={faUsers} className="text-primary" {...props} />;

export default function Home() {

  const [loading] = useState(true);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <img src="/logo.ico" alt="Loading..." style={{ width: 56, height: 56, marginBottom: 16, animation: 'pulse 1.5s infinite' }} />
        <p className="mt-2">Loading EMS...</p>
      </div>
    );
  }


  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
        <UsersIcon style={{ fontSize: 28 }} className="me-2 text-primary" />
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          E M S
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        Employee Management System
      </div>
      <div className="mb-3"></div>
    </div>
  );
}