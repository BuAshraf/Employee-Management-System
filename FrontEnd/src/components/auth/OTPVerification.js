import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call for OTP verification
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('OTP verified successfully! You can now reset your password.');
            navigate('/auth', { state: { resetToken: 'dummy-reset-token', email } });
        } catch (error) {
            console.error('OTP verification error:', error);
            toast.error('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setResendLoading(true);

        try {
            // Simulate API call for resending OTP
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('New OTP sent to your email');
            setCountdown(60);
            setCanResend(false);
        } catch (error) {
            console.error('Resend OTP error:', error);
            toast.error('Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
        if (value.length <= 6) {
            setOtp(value);
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
                                    <h4 className="card-title">Verify OTP</h4>
                                    <p className="text-muted">
                                        We've sent a 6-digit code to<br />
                                        <strong>{email}</strong>
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="otp" className="form-label">
                                            Enter OTP
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control text-center fs-4 letter-spacing-3"
                                            id="otp"
                                            value={otp}
                                            onChange={handleOtpChange}
                                            placeholder="000000"
                                            maxLength="6"
                                            style={{ letterSpacing: '0.5em' }}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-3"
                                        disabled={loading || otp.length !== 6}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Verifying...
                                            </>
                                        ) : (
                                            'Verify OTP'
                                        )}
                                    </button>

                                    <div className="text-center">
                                        {canResend ? (
                                            <button
                                                type="button"
                                                className="btn btn-link text-decoration-none p-0"
                                                onClick={handleResendOTP}
                                                disabled={resendLoading}
                                            >
                                                {resendLoading ? 'Sending...' : 'Resend OTP'}
                                            </button>
                                        ) : (
                                            <span className="text-muted">
                                                Resend OTP in {countdown}s
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-center mt-3">
                                        <Link to="/forgot-password" className="text-decoration-none">
                                            <i className="bi bi-arrow-left me-2"></i>
                                            Back to Forgot Password
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

export default OTPVerification;
