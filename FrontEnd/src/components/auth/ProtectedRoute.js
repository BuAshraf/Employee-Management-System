import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // If a specific role is required, check if user has it
    if (requiredRole && user.role !== requiredRole) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Access Denied</h4>
                    <p>You don't have permission to access this page.</p>
                    <hr />
                    <p className="mb-0">Required role: {requiredRole}</p>
                </div>
            </div>
        );
    }

    // If authenticated and authorized, render the children
    return children;
};

export default ProtectedRoute;
