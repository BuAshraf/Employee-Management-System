// src/components/pages/Home.js

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

const UsersIcon = (props) => <FontAwesomeIcon icon={faUsers} className="text-primary" {...props} />;

export default function Home() {

  // const [loading] = useState(true);

  // if (loading) {
  //   return (
  //     <div className="text-center mt-5">
  //       <img src="/logo.ico" alt="Loading..." style={{ width: 56, height: 56, marginBottom: 16, animation: 'pulse 1.5s infinite' }} />
  //       <p className="mt-2">Loading EMS...</p>
  //     </div>
  //   );
  // }

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-2">
        <UsersIcon style={{ fontSize: 28 }} className="me-2 text-primary" />
        <span style={{ fontWeight: 600, fontSize: '1.7rem', color: '#212529' }}>
          Welcome to E M S
        </span>
      </div>
      <div className="mb-4" style={{ fontSize: '1.1rem', color: '#444' }}>
        Employee Management System
      </div>
      <div className="mb-3" style={{ fontSize: '1rem', color: '#555' }}>
        EMS is a refined, modern platform that centralizes workforce management and serves as a unified hub for all employee data. It automates routine HR tasks, turning time-consuming processes into a streamlined workflow. With its sophisticated features and an intuitive interface, EMS delivers a seamless and efficient management experience.
      </div>


      <div className="card p-3 d-flex flex-row align-items-center" style={{ backgroundColor: '#f8f9fa', border: '1px solid #ccc', borderRadius: '8px', marginTop: '2rem' }}>
        <img src="/me.jpg" alt="Portfolio Site" style={{ width: '80px', height: '80px', marginRight: '20px' }} />
        <div>
          <h5 style={{ marginBottom: '10px', color: '#333' }}>Portfolio Site</h5>
          <a href="https://your-portfolio-site.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Visit Portfolio
          </a>
        </div>
      </div>
    </div>
  );


}
