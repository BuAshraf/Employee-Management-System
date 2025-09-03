
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';

const UsersIcon = (props) => <FontAwesomeIcon icon={faUsers} className="text-primary" {...props} />;

function Home() {
  const { t, lang } = useI18n();
  const [showPageSelector, setShowPageSelector] = useState(false);

  return (
    <div className="container mt-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Section - Similar to Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <UsersIcon
            style={{ fontSize: 32 }}
            className={lang === 'ar' ? 'ms-3 text-primary' : 'me-3 text-primary'}
          />
          <div>
            <h2 className="mb-1" style={{ color: '#111', fontWeight: 700, letterSpacing: '0.5px' }}>
              {t('welcome')}
            </h2>
            <div className="text-muted" style={{ fontSize: '1.1rem' }}>
              {t('employeeManagement')}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center">
          {/* Page Selector - Similar to Dashboard Selector
          <div className="dropdown me-3">
            <button
              className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
              type="button"
              onClick={() => setShowPageSelector(!showPageSelector)}
              style={{ minWidth: '160px' }}
            >
              <i className="fas fa-home me-2"></i>
              {t('home') || 'Home'}
              <FontAwesomeIcon icon={faChevronDown} className="ms-2" style={{ fontSize: '12px' }} />
            </button>
            {showPageSelector && (
              <ul className="dropdown-menu show" style={{ minWidth: '160px' }}>
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setShowPageSelector(false)}
                  >
                    <i className="fas fa-home me-2 text-primary"></i>
                    {t('home') || 'Home'}
                    <span className="badge bg-primary ms-auto">{t('current') || 'Current'}</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="dropdown-item d-flex align-items-center"
                    onClick={() => setShowPageSelector(false)}
                  >
                    <i className="fas fa-chart-bar me-2 text-success"></i>
                    {t('dashboard') || 'Dashboard'}
                  </Link>
                </li>
              </ul>
            )}
          </div> */}

          {/* <button
            onClick={() => setShowPrivacy(true)}
            className="btn btn-outline-primary px-4"
          >
            <i className="fas fa-shield-alt me-2"></i>
            {t('privacyPolicy') || 'Privacy Policy'}
          </button> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="row">
        {/* Welcome Description Card */}
        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                {t('welcomeToEMS') || 'Welcome to Employee Management System'}
              </h5>
            </div>
            <div className="card-body">
              <p style={{
                fontSize: '1rem',
                color: '#555',
                textAlign: lang === 'ar' ? 'right' : 'left',
                lineHeight: '1.6'
              }}>
                {t('homeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Cards */}
        <div className="col-md-12 mb-4">
          <div className="row">
            <div className="col-md-3">
              <Link to="/employees" className="text-decoration-none">
                <div className="card bg-primary text-white h-100">
                  <div className="card-body d-flex align-items-center">
                    <i className="fas fa-users fa-2x me-3"></i>
                    <div>
                      <h6 className="card-title mb-1">{t('employees')}</h6>
                      <small>{t('manageEmployees') || 'Manage Employees'}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="/departments" className="text-decoration-none">
                <div className="card bg-success text-white h-100">
                  <div className="card-body d-flex align-items-center">
                    <i className="fas fa-building fa-2x me-3"></i>
                    <div>
                      <h6 className="card-title mb-1">{t('departments')}</h6>
                      <small>{t('manageDepartments') || 'Manage Departments'}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="/reports" className="text-decoration-none">
                <div className="card bg-info text-white h-100">
                  <div className="card-body d-flex align-items-center">
                    <i className="fas fa-chart-bar fa-2x me-3"></i>
                    <div>
                      <h6 className="card-title mb-1">{t('reports')}</h6>
                      <small>{t('viewReports') || 'View Reports'}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="/dashboard" className="text-decoration-none">
                <div className="card bg-warning text-white h-100">
                  <div className="card-body d-flex align-items-center">
                    <i className="fas fa-tachometer-alt fa-2x me-3"></i>
                    <div>
                      <h6 className="card-title mb-1">{t('dashboard')}</h6>
                      <small>{t('viewDashboard') || 'View Dashboard'}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0" style={{ textAlign: lang === 'ar' ? 'right' : 'left' }}>
                {t('aboutDeveloper') || 'About Developer'}
              </h5>
            </div>
            <div className="card-body">
              <div className={`d-flex align-items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <img
                  src="/me.jpg"
                  alt="Portfolio Site"
                  style={{
                    width: '80px',
                    height: '80px',
                    marginRight: lang === 'ar' ? 0 : '20px',
                    marginLeft: lang === 'ar' ? '20px' : 0,
                    borderRadius: '8px'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h6 style={{
                    marginBottom: '10px',
                    color: '#333',
                    textAlign: lang === 'ar' ? 'right' : 'left'
                  }}>
                    {t('portfolioSite')}
                  </h6>
                  <a href="https://your-portfolio-site.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm">
                    <i className="fas fa-external-link-alt me-2"></i>
                    {t('visitPortfolio')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
  );
};

export default Home;
