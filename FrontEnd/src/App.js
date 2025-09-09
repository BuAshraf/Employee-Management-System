import React, { Suspense } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Authentication removed



import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// lazily-loaded pages / views
import { lazyLoad } from './utils/lazyLoad';
import PageBackground from './components/layout/PageBackground';

// Auth components removed

// lazily-loaded layout components
const Navbar = lazyLoad(() => import('./components/layout/Navbar'));
const Footer = lazyLoad(() => import('./components/layout/Footer'));
// PageHeader unused; removed to silence lint warning

// lazy components
const Home = lazyLoad(() => import('./components/pages/Home'));
const EmployeeList = lazyLoad(() => import('./components/employee/EmployeeList'));
const AddEmployee = lazyLoad(() => import('./components/employee/AddEmployee'));
const UpdateEmployee = lazyLoad(() => import('./components/employee/UpdateEmployee'));
const EmployeeDetails = lazyLoad(() => import('./components/employee/EmployeeDetails'));
const Dashboard = lazyLoad(() => import('./components/dashboard/Dashboard'));
const Reports = lazyLoad(() => import('./components/reports/Reports'));
const CompanyPage = lazyLoad(() => import('./components/pages/CompanyPage'));
const Settings = lazyLoad(() => import('./components/pages/Settings'));
const NotificationPage = lazyLoad(() => import('./components/pages/NotificationPage'));
// Auth pages removed
const DepartmentList = lazyLoad(() => import('./components/department/DepartmentList'));
const Profile = lazyLoad(() => import('./components/profile/Profile.jsx'));
const AdminControlPanel = lazyLoad(() => import('./components/admin/AdminControlPanel'));

// Loading component with logo
const LoadingComponent = () => (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
    <img
      src="/logo11.png"
      alt="Loading..."
      style={{ width: '64px', height: '64px', animation: 'pulse 1.5s ease-in-out infinite' }}
      className="mb-3"
    />
    <output className="spinner-border text-primary">
      <span className="visually-hidden">Loading...</span>
    </output>
    <p className="mt-2 text-muted">Loading Employee Management System...</p>
  </div>
);

// Main App Content Component
const AppContent = () => {
  const isAuthenticated = true;

  return (
    <div className="d-flex flex-column min-vh-100" style={{ position: 'relative' }}>
      {/* Global page background */}
      <PageBackground />
      <Suspense fallback={<LoadingComponent />}>
        {/*  Navbar  */}
  <div style={{ position: 'relative', zIndex: 9999 }}>
          <Navbar />
        </div>

        {/* main content */}
        <main className={`${isAuthenticated ? 'container-fluid mt-3 mb-5' : ''} flex-grow-1`} style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            {/* Auth routes removed */}

            {/* Protected Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/companies" element={<CompanyPage />} />


            <Route path="/employees" element={
              <EmployeeList />
            } />

            <Route path="/departments" element={
              <DepartmentList />
            } />

            <Route path="/employees/add" element={
              <AddEmployee />
            } />

            <Route path="/employees/edit/:id" element={
              <UpdateEmployee />
            } />

            <Route path="/employees/view/:id" element={
              <EmployeeDetails />
            } />


            <Route path="/dashboard" element={
              <Dashboard />
            } />

            <Route path="/reports" element={
              <Reports />
            } />

            <Route path="/profile" element={
              <Profile />
            } />

            <Route path="/settings" element={
              <Settings />
            } />

            <Route path="/notifications" element={
              <NotificationPage />
            } />

            <Route path="/admin" element={
              <AdminControlPanel />
            } />

            {/* Redirect based on auth status */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Footer  */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Footer />
        </div>
      </Suspense>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;