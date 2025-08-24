import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call for forgot password
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Password reset instructions sent to your email');
            navigate('/verify-otp', { state: { email } });
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error('Failed to send reset instructions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className="text-center mb-4">
                                    <img
                                        src="/logo11.png"
                                        alt="EMS Logo"
                                        style={{ width: '64px', height: '64px' }}
                                        className="mb-3"
                                    />
                                    <h4 className="card-title">Forgot Password</h4>
                                    <p className="text-muted">
                                        Enter your email address and we'll send you instructions to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Reset Instructions'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        <Link to="/auth" className="text-decoration-none">
                                            <i className="bi bi-arrow-left me-2"></i>
                                            Back to Login
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
