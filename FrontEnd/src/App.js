import React, { Suspense } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

// lazily-loaded pages / views
import { lazyLoad } from './utils/lazyLoad';

// lazily-loaded layout components
const Navbar = lazyLoad(() => import('./components/layout/Navbar'));
const Footer = lazyLoad(() => import('./components/layout/Footer'));
const PageHeader = lazyLoad(() => import('./components/layout/PageHeader'));

// lazy components
const Home = lazyLoad(() => import('./components/pages/Home'));
const EmployeeList = lazyLoad(() => import('./components/employee/EmployeeList'));
const AddEmployee = lazyLoad(() => import('./components/employee/AddEmployee'));
const UpdateEmployee = lazyLoad(() => import('./components/employee/UpdateEmployee'));
const EmployeeDetails = lazyLoad(() => import('./components/employee/EmployeeDetails'));
const Dashboard = lazyLoad(() => import('./components/dashboard/Dashboard'));
const Reports = lazyLoad(() => import('./components/pages/Reports'));
const Settings = lazyLoad(() => import('./components/pages/Settings'));

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

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        {/* show a loading component with logo while any chunk is downloading */}
        <Suspense fallback={<LoadingComponent />}>
          {/* top nav */}
          <Navbar />

          {/* main content */}
          <main className="container-fluid mt-3 mb-5 flex-grow-1">
            <Routes>
              {/* Home */}
              <Route path="/" element={<Home />} />

              {/* Employee Management */}
              <Route
                path="/employees"
                element={
                    <EmployeeList />
                }
              />

              <Route
                path="/employees/add"
                element={
                  <>
                    <PageHeader
                      title="Add New Employee"
                      subtitle="Enter the details of the new employee."
                    />
                    <AddEmployee />
                  </>
                }
              />

              <Route
                path="/employees/edit/:id"
                element={
                    <UpdateEmployee />
                }
              />

              <Route
                path="/employees/view/:id"
                element={
                    <EmployeeDetails />
                }
              />

              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Reports */}
              <Route path="/reports" element={<Reports />} />

              {/* Settings */}
              <Route path="/settings" element={<Settings />} />

              {/* catch‐all → go home */}
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

          {/* footer */}
          <Footer />
        </Suspense>
      </Router>

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
}

export default App;