import React, { useState } from 'react';
import FooterModals from './FooterModals';

export default function Footer() {
  const [modalType, setModalType] = useState(null);
  const handleOpenModal = (type) => setModalType(type);
  const handleCloseModal = () => setModalType(null);

  return (
    <footer className="footer mt-auto py-4 bg-dark text-white" dir="ltr">
      <div className="container">
        <div className="row align-items-center">
          {/* Left side: Logo and company info */}
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-2 mb-md-0">
              <img
                src="/(EMS)_logo.png"
                alt="EMS Logo"
                style={{ width: '40px', height: '40px' }}
                className="me-3"
              />
              <div>
                <h6 className="mb-0 fw-bold">Employee Management System</h6>
                <small className="text-white-50">Streamlining workforce management</small>
              </div>
            </div>
          </div>

          {/* Right side: Links and copyright */}
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-8">
                <div className="d-flex flex-wrap justify-content-md-end">
                  <button type="button" className="btn btn-link text-white-50 text-decoration-none me-3 mb-1 p-0" style={{ boxShadow: 'none' }} onClick={() => handleOpenModal('privacy')}>
                    <i className="fas fa-shield-alt me-1"></i>Privacy Policy
                  </button>
                  <button type="button" className="btn btn-link text-white-50 text-decoration-none me-3 mb-1 p-0" style={{ boxShadow: 'none' }} onClick={() => handleOpenModal('terms')}>
                    <i className="fas fa-file-contract me-1"></i>Terms of Service
                  </button>
                  <button type="button" className="btn btn-link text-white-50 text-decoration-none me-3 mb-1 p-0" style={{ boxShadow: 'none' }} onClick={() => handleOpenModal('support')}>
                    <i className="fas fa-life-ring me-1"></i>Support
                  </button>
                  <a
                    href="https://github.com/BuAshraf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white-50 text-decoration-none mb-1"
                  >
                    <i className="fab fa-github me-1"></i>GitHub
                  </a>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-md-end">
                  <small>
                    <span className="text-white-50">&copy; 2025 Muhammed Ashraf Alkulaib. All rights reserved.</span>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <hr className="my-3 border-secondary" />
        <div className="row">
          <div className="col-md-6">
            <small className="text-white-50">
              <i className="fas fa-code me-1"></i>
              Built with React & Spring Boot
            </small>
          </div>
          <div className="col-md-6 text-md-end">
            <small className="text-muted">
              Version 1.0.0 |
              <button type="button" className="btn btn-link text-white-50 text-decoration-none ms-1 p-0" style={{ boxShadow: 'none' }} onClick={() => handleOpenModal('changelog')}>
                What's New
              </button>
            </small>
          </div>
        </div>
      </div>
      <FooterModals show={!!modalType} type={modalType} onClose={handleCloseModal} />
    </footer>
  );
}