import React, { useState, useEffect } from 'react';
import '../../styles/navbar-anim.css';
import { Link, useLocation } from 'react-router-dom';

import html2canvas from 'html2canvas';
import emailjs from 'emailjs-com';

export default function Navbar() {
  // Theme state for Navbar switcher
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ems_settings');
    if (saved) {
      try {
        return JSON.parse(saved).theme || 'light';
      } catch {
        return 'light';
      }
    }
    return 'light';
  });

  // Sync theme with body and localStorage
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let appliedTheme = theme;
    if (theme === 'auto') {
      appliedTheme = prefersDark ? 'dark' : 'light';
    }
    document.body.classList.remove('ems-dark', 'ems-light');
    document.body.classList.add(appliedTheme === 'dark' ? 'ems-dark' : 'ems-light');
    // Update settings in localStorage
    const saved = localStorage.getItem('ems_settings');
    let settings = saved ? JSON.parse(saved) : {};
    settings.theme = theme;
    localStorage.setItem('ems_settings', JSON.stringify(settings));
  }, [theme]);

  // Theme switcher handler
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Support popup logic
  const handleSupportClick = (e) => {
    e.preventDefault();
    setShowSupportPopup(true);
  };

  const handleSendSupport = async () => {
    setSending(true);
    try {
      // Capture screenshot
      const canvas = await html2canvas(document.body);
      const screenshot = canvas.toDataURL('image/png');

      // Example user info (replace with real user data if available)
      const to_name = 'User'; // Replace with actual user name from your auth/user context
      const user_email = 'user@email.com'; // Replace with actual user email from your auth/user context

      // Send support screenshot email to admin
      await emailjs.send(
        'service_of80oqi',
        'template_m6z7hue',
        {
          from_name: to_name,
          message: 'Support request with screenshot',
          screenshot: screenshot
        },
        'LD4XBjznzfQqThmz2'
      );

      // Send auto-reply to user
      await emailjs.send(
        'service_of80oqi',
        'template_d3m0ikh',
        {
          to_name: to_name,
          user_email: user_email,
          message: 'Support request with screenshot'
        },
        'LD4XBjznzfQqThmz2'
      );

      setSending(false);
      setShowSupportPopup(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2500);
    } catch (error) {
      setSending(false);
      alert('Failed to send support request. Please try again.');
    }
  };

  const handleCloseSupport = () => {
    setShowSupportPopup(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top navbar-anim">
      <div className="container-fluid">
        {/* Brand with logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img 
            src={process.env.PUBLIC_URL + '/logo.ico'}
            alt="EMS Logo" 
            style={{ width: '32px', height: '32px' }}
            className="me-2"
          />
          <span className="d-none d-sm-inline">Employee Management System</span>
          <span className="d-inline d-sm-none">EMS</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className={`navbar-toggler${!isCollapsed ? ' x' : ''}`}
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>

        {/* Collapsible nav items */}
        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">


            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/')}`} to="/">
                <i className="fas fa-users me-1"></i>
                Employees
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/dashboard')}`} to="/dashboard">
                <i className="fas fa-tachometer-alt me-1"></i>
                Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link px-3 ${isActive('/reports')}`} to="/reports">
                <i className="fas fa-chart-bar me-1"></i>
                Reports
              </Link>
            </li>
          </ul>

          {/* Theme Switcher */}
          <div className="d-flex align-items-center me-3">
            <select
              className="form-select form-select-sm bg-dark text-light border-0 shadow-none"
              style={{ width: 90, minWidth: 90, background: 'linear-gradient(90deg,#23272b,#181a1b)', color: '#fff', fontWeight: 500 }}
              value={theme}
              onChange={handleThemeChange}
              aria-label="Theme Switcher"
            >
              <option value="light">☀ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="auto">🖥 Auto</option>
            </select>
          </div>
          {/* Right side items */}
          <ul className="navbar-nav">
            {/* Quick Actions */}
            <li className="nav-item dropdown me-2">
             <button
               className="nav-link dropdown-toggle btn btn-link p-0 border-0"
               id="quickActionsDropdown"
               data-bs-toggle="dropdown"
               aria-expanded="false"
               tabIndex={0}
               aria-haspopup="true"
               type="button"
               style={{ boxShadow: 'none', background: 'none' }}
             >
               <i className="fas fa-bolt me-1"></i>
               <span className="d-none d-lg-inline">Quick Actions</span>
             </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/employees/add">
                    <i className="fas fa-user-plus me-2 text-success"></i>Add Employee
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/reports">
                    <i className="fas fa-chart-line me-2 text-success"></i>View Reports
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" type="button" onClick={(e) => e.preventDefault()}>
                    <i className="fas fa-download me-2 text-info"></i>Export Data
                  </button>
                 </li>
              </ul>
            </li>

            {/* User Profile */}
             <li className="nav-item dropdown">
               <button
                 className="nav-link dropdown-toggle d-flex align-items-center btn btn-link p-0 border-0"
                 id="navbarDropdown"
                 data-bs-toggle="dropdown"
                 aria-expanded="false"
                 tabIndex={0}
                 aria-haspopup="true"
                 type="button"
                 style={{ boxShadow: 'none', background: 'none' }}
               >
                 <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                      style={{ width: '28px', height: '28px' }}>
                   <i className="fas fa-user text-primary" style={{ fontSize: '14px' }}></i>
                 </div>
                 <span className="d-none d-lg-inline">Admin</span>
               </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <div className="dropdown-header">
                    <strong>Administrator</strong>
                    <br />
                    <small className="text-muted">admin@ems.com</small>
                  </div>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="fas fa-user me-2"></i>My Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/settings">
                    <i className="fas fa-cog me-2"></i>Settings
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" type="button" onClick={handleSupportClick}>
                    <i className="fas fa-question-circle me-2"></i>Help & Support
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" type="button" onClick={(e) => e.preventDefault()}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Support Popup */}
      {showSupportPopup && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          width: '320px',
          height: '180px',
          background: '#fff',
          boxShadow: '2px 2px 12px rgba(0,0,0,0.15)',
          borderRadius: '8px',
          zIndex: 2000,
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
          <div style={{fontWeight: 600, marginBottom: 8}}>Support Request</div>
          <div style={{fontSize: 13, marginBottom: 12}}>A screenshot of your current screen will be sent to our support team.</div>
          <div style={{display: 'flex', gap: 8, width: '100%'}}>
            <button className="btn btn-primary btn-sm" style={{minWidth: 70}} onClick={handleSendSupport} disabled={sending}>
              {sending ? 'Sending...' : 'Send'}
            </button>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleCloseSupport} disabled={sending}>Cancel</button>
          </div>
        </div>
      )}

      {/* Thin Notification */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: '#e6f7e6',
          color: '#218838',
          border: '1px solid #b2dfb2',
          borderRadius: '4px',
          padding: '8px 18px',
          fontWeight: 500,
          zIndex: 3000,
          boxShadow: '1px 1px 8px rgba(0,0,0,0.08)'
        }}>
          Thank you for sharing
        </div>
      )}
    </nav>
  );
}