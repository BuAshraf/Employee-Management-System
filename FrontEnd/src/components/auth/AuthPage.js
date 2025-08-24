import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Building2, Shield, Users, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AuthPage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isEmployeeLogin, setIsEmployeeLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const [demoRoles, setDemoRoles] = useState([]);
    const [loadingDemoRoles, setLoadingDemoRoles] = useState(false);
    const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'connected', 'fallback'

    const navigate = useNavigate();
    const location = useLocation();
    const { syncAuthState } = useAuth();
    const from = location.state?.from?.pathname || '/dashboard';

    // Set axios defaults
    axios.defaults.withCredentials = true;

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        employeeId: '',
        department: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    // Fetch demo roles on component mount
    useEffect(() => {
        fetchDemoRoles();
    }, []);

    const fetchDemoRoles = async () => {
        setLoadingDemoRoles(true);
        try {
            const roles = await AuthService.getDemoRoles();
            // Ensure roles is always an array
            const rolesArray = Array.isArray(roles) ? roles :
                Array.isArray(roles?.data) ? roles.data : [];
            setDemoRoles(rolesArray);
            setBackendStatus('connected');
        } catch (error) {
            console.error('Error fetching demo roles:', error);
            setBackendStatus('fallback');
            // Fallback to hardcoded roles if API fails
            setDemoRoles([
                { value: 'admin', label: '👑 System Administrator', email: 'admin@company.com', password: 'admin123', description: 'Full system access, user management, all reports' },
                { value: 'hr', label: '👥 HR Manager', email: 'hr.manager@company.com', password: 'hr123', description: 'Employee lifecycle, policies, recruitment, personnel records' },
                { value: 'manager', label: '🏢 General Manager', email: 'manager@company.com', password: 'manager123', description: 'Team management, performance reviews, departmental oversight' },
                { value: 'employee', label: '👤 Regular Employee', email: 'john.doe@company.com', password: 'employee123', description: 'Personal profile, timesheet, requests, basic reports' },
                { value: 'departmentHead', label: '🏛️ Department Head', email: 'dept.head@company.com', password: 'dept123', description: 'Manage specific department, budget oversight, strategic planning' },
                { value: 'financeManager', label: '💰 Finance Manager', email: 'finance.manager@company.com', password: 'finance123', description: 'Access to salary/budget data, financial reports, cost analysis' },
                { value: 'itSupport', label: '🔧 IT Support', email: 'it.support@company.com', password: 'it123', description: 'System maintenance access, user support, technical administration' },
            ]);
            toast.error('Backend unavailable. Using demo data.');
        } finally {
            setLoadingDemoRoles(false);
        }
    };

    const handleLoginChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateLogin = () => {
        const newErrors = {};
        if (!loginData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!loginData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateRegister = () => {
        const newErrors = {};
        if (!registerData.name) newErrors.name = 'Name is required';
        if (!registerData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!registerData.employeeId) newErrors.employeeId = 'Employee ID is required';
        if (!registerData.department) newErrors.department = 'Department is required';
        if (!registerData.password) {
            newErrors.password = 'Password is required';
        } else if (registerData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmployeeLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8081/employeelogin', {
                email: loginData.email,
                password: loginData.password
            });

            if (response.data.Status === 'Success') {
                const id = response.data.id;
                toast.success('Employee login successful!');
                navigate(`/employeedetail/${id}`, { replace: true });
            } else {
                const message = response.data.Error || 'Employee login failed. Please try again.';
                toast.error(message);
                setErrors({ submit: message });
            }
        } catch (error) {
            const message = error.response?.data?.Error || 'Employee login failed. Please try again.';
            toast.error(message);
            setErrors({ submit: message });
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8081/login', {
                email: loginData.email,
                password: loginData.password
            });

            if (response.data.Status === 'Success') {
                toast.success('Admin login successful!');
                navigate('/dashboard', { replace: true });
            } else {
                const message = response.data.Error || 'Admin login failed. Please try again.';
                toast.error(message);
                setErrors({ submit: message });
            }
        } catch (error) {
            const message = error.response?.data?.Error || 'Admin login failed. Please try again.';
            toast.error(message);
            setErrors({ submit: message });
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateLogin()) return;

        setLoading(true);
        try {
            // Use different login endpoints based on login type
            if (isEmployeeLogin) {
                await handleEmployeeLoginSubmit(e);
                return;
            }

            await AuthService.login(loginData.email, loginData.password);

            // Sync the AuthContext with the API authentication
            setTimeout(() => {
                syncAuthState();
                toast.success('Login successful!');
                navigate(from, { replace: true });
            }, 100);

        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            setErrors({ submit: message });
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateRegister()) return;

        setLoading(true);
        try {
            await AuthService.register(registerData);
            toast.success('Registration successful! Please login.');
            setIsSignUp(false);
            // Clear forms
            setRegisterData({
                name: '',
                email: '',
                employeeId: '',
                department: '',
                password: '',
                confirmPassword: '',
            });
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            setErrors({ submit: message });
        } finally {
            setLoading(false);
        }
    };

    const quickAdminLogin = async () => {
        try {
            setLoading(true);

            // Get admin credentials
            const adminRole = getDemoRoles().find(r => r.value === 'admin');
            if (!adminRole) {
                toast.error('Admin credentials not available');
                return;
            }

            // Fill the form with admin credentials
            setLoginData(prev => ({
                ...prev,
                email: adminRole.email,
                password: adminRole.password
            }));

            // Auto-login with admin credentials
            await AuthService.login(adminRole.email, adminRole.password);

            // Sync the AuthContext with the API authentication
            setTimeout(() => {
                syncAuthState();
                toast.success('🎉 Logged in as System Administrator!');
                navigate('/dashboard', { replace: true });
            }, 100);

        } catch (error) {
            const message = error.response?.data?.message || 'Admin login failed. Please try again.';
            toast.error(message);
            setErrors({ submit: message });
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = async (type) => {
        try {
            setLoading(true);

            // First try to get credentials from API
            let credentials = null;
            try {
                credentials = await AuthService.getDemoCredentials(type);
            } catch (error) {
                console.log('API not available, using fallback credentials');
            }

            // If API fails, use hardcoded credentials
            if (!credentials) {
                const role = getDemoRoles().find(r => r.value === type);
                if (role && role.password) {
                    credentials = {
                        email: role.email,
                        password: role.password
                    };
                }
            }

            if (credentials) {
                setLoginData(prev => ({
                    ...prev,
                    email: credentials.email,
                    password: credentials.password
                }));
                setShowDemoModal(false);
                setSelectedRole('');

                // Show success message with role name
                const roleName = getDemoRoles().find(r => r.value === type)?.label || type;
                toast.success(`${roleName} credentials loaded! Click Sign In to continue.`);
            } else {
                toast.error('Demo credentials not available for this role');
            }
        } catch (error) {
            console.error('Error fetching demo credentials:', error);
            toast.error('Failed to load demo credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoSelection = () => {
        if (selectedRole) {
            fillDemoCredentials(selectedRole);
        }
    };

    const getDemoRoles = () => Array.isArray(demoRoles) ? demoRoles : [];

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setErrors({});
        setLoginData({ email: '', password: '', rememberMe: false });
        setRegisterData({
            name: '',
            email: '',
            employeeId: '',
            department: '',
            password: '',
            confirmPassword: '',
        });
    };

    const pageVariants = {
        initial: { opacity: 0, x: isSignUp ? 50 : -50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isSignUp ? -50 : 50 },
    };

    const InputField = ({ icon: Icon, error, type = "text", className = "", ...props }) => (
        <div className="relative">
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                        <Icon size={20} />
                    </div>
                )}
                <input
                    className={`w-full px-10 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${error
                        ? 'border-red-400 focus:ring-red-200 focus:bg-red-50'
                        : 'border-slate-200 focus:ring-blue-200 focus:border-blue-400 focus:bg-white'
                        } ${className}`}
                    type={type}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );

    const EMSLogo = () => (
        <svg viewBox="0 0 200 200" className="w-16 h-16">
            <g transform="translate(100, 100)">
                <path d="M 0,-60 L 60,0 L 0,60 L -60,0 Z" fill="#64748b" opacity="0.1" />
                <path d="M 0,-50 L 50,0 L 0,50 L -50,0 Z" fill="none" stroke="#64748b" strokeWidth="2" />
                <circle cx="0" cy="0" r="25" fill="none" stroke="#3b82f6" strokeWidth="3" />
                <circle cx="0" cy="0" r="15" fill="#3b82f6" opacity="0.2" />
                <circle cx="0" cy="0" r="8" fill="#3b82f6" />
                <circle cx="-35" cy="-35" r="8" fill="#64748b" opacity="0.6" />
                <circle cx="35" cy="-35" r="8" fill="#3b82f6" opacity="0.8" />
                <circle cx="35" cy="35" r="8" fill="#64748b" opacity="0.6" />
                <circle cx="-35" cy="35" r="8" fill="#3b82f6" opacity="0.8" />
                <line x1="-50" y1="0" x2="-25" y2="0" stroke="#64748b" strokeWidth="2" />
                <line x1="25" y1="0" x2="50" y2="0" stroke="#64748b" strokeWidth="2" />
                <line x1="0" y1="-50" x2="0" y2="-25" stroke="#64748b" strokeWidth="2" />
                <line x1="0" y1="25" x2="0" y2="50" stroke="#64748b" strokeWidth="2" />
            </g>
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
            {/* Left Side - Info Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
                    }}></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-8">
                        <EMSLogo />
                        <div>
                            <h1 className="text-3xl font-bold text-white">EMS</h1>
                            <p className="text-slate-300 text-sm">Employee Management System</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Streamline Your Workforce Management
                        </h2>
                        <p className="text-slate-300 text-lg">
                            Comprehensive solution for managing employees, tracking performance, and enhancing productivity with modern security features.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">Employee Directory</h3>
                            <p className="text-slate-400 text-sm">Centralized database with advanced search and filtering</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">JWT Security</h3>
                            <p className="text-slate-400 text-sm">Multi-factor authentication with email OTP verification</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-1">Role-Based Access</h3>
                            <p className="text-slate-400 text-sm">Granular permissions for different organizational roles</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSignUp ? 'signup' : 'signin'}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-md"
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                                <EMSLogo />
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">EMS</h1>
                                    <p className="text-slate-500 text-xs">Employee Management</p>
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                                </h2>
                                <p className="text-slate-500 mt-2">
                                    {isSignUp ? 'Join your organization with secure verification' : 'Sign in to access your dashboard'}
                                </p>
                            </div>

                            {errors.submit && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm">{errors.submit}</p>
                                </div>
                            )}

                            {!isSignUp && (
                                <>
                                    {/* Login Type Selection */}
                                    <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                        <h4 className="font-semibold text-slate-800 mb-3">Login Type</h4>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsEmployeeLogin(false)}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                                    !isEmployeeLogin 
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                                                }`}
                                            >
                                                <Shield className="w-4 h-4 inline mr-2" />
                                                Admin Login
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEmployeeLogin(true)}
                                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                                    isEmployeeLogin 
                                                        ? 'bg-green-600 text-white' 
                                                        : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                                                }`}
                                            >
                                                <User className="w-4 h-4 inline mr-2" />
                                                Employee Login
                                            </button>
                                        </div>
                                    </div>

                                    {/* Demo Credentials - Only show for Admin Login */}
                                    {!isEmployeeLogin && (
                                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-blue-800">Demo Credentials</h4>
                                                <div className="flex items-center space-x-2">
                                                    {backendStatus === 'connected' ? (
                                                        <div className="flex items-center space-x-1">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span className="text-xs text-green-600">Backend Connected</span>
                                                        </div>
                                                    ) : backendStatus === 'fallback' ? (
                                                        <div className="flex items-center space-x-1">
                                                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                                            <span className="text-xs text-yellow-600">Demo Mode</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-1">
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                                            <span className="text-xs text-gray-500">Connecting...</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-blue-600 mb-3">
                                                Try different user roles to explore the system
                                            </p>
                                            <div className="space-y-2">
                                                <button
                                                    type="button"
                                                    onClick={quickAdminLogin}
                                                    disabled={loading}
                                                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                                >
                                                    {loading ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        />
                                                    ) : (
                                                        <>
                                                            <Shield className="w-4 h-4" />
                                                            <span>Quick Admin Login</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDemoModal(true)}
                                                    disabled={loadingDemoRoles}
                                                    className="w-full bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loadingDemoRoles ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        />
                                                    ) : (
                                                        <>
                                                            <Users className="w-4 h-4" />
                                                            <span>Other Demo Roles</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Employee Login Instructions */}
                                    {isEmployeeLogin && (
                                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center mb-2">
                                                <User className="w-5 h-5 text-green-600 mr-2" />
                                                <h4 className="font-semibold text-green-800">Employee Portal</h4>
                                            </div>
                                            <p className="text-sm text-green-600">
                                                Use your employee credentials to access your personal dashboard and profile information.
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {!isSignUp ? (
                                <form onSubmit={isEmployeeLogin ? handleEmployeeLoginSubmit : handleAdminLoginSubmit} className="space-y-4">
                                    <InputField
                                        icon={Mail}
                                        type="email"
                                        placeholder="Work Email"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        error={errors.email}
                                        required
                                    />

                                    <div className="relative">
                                        <InputField
                                            icon={Lock}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            name="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            error={errors.password}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="rememberMe"
                                                checked={loginData.rememberMe}
                                                onChange={handleLoginChange}
                                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-slate-600">Remember me</span>
                                        </label>
                                        <button
                                            type="button"
                                            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            <>
                                                Sign In
                                                <ChevronRight className="ml-2 w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            ) : (
                                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <InputField
                                            icon={User}
                                            type="text"
                                            placeholder="Full Name"
                                            name="name"
                                            value={registerData.name}
                                            onChange={handleRegisterChange}
                                            error={errors.name}
                                            required
                                        />

                                        <InputField
                                            icon={Building2}
                                            type="text"
                                            placeholder="Employee ID"
                                            name="employeeId"
                                            value={registerData.employeeId}
                                            onChange={handleRegisterChange}
                                            error={errors.employeeId}
                                            required
                                        />

                                        <div className="relative">
                                            <select
                                                name="department"
                                                value={registerData.department}
                                                onChange={handleRegisterChange}
                                                className={`w-full px-3 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${errors.department
                                                    ? 'border-red-400 focus:ring-red-200 focus:bg-red-50'
                                                    : 'border-slate-200 focus:ring-blue-200 focus:border-blue-400 focus:bg-white'
                                                    }`}
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                <option value="IT">Information Technology</option>
                                                <option value="HR">Human Resources</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Operations">Operations</option>
                                                <option value="Sales">Sales</option>
                                            </select>
                                            {errors.department && (
                                                <p className="text-red-500 text-sm mt-1 ml-1">
                                                    {errors.department}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>

                                    <InputField
                                        icon={Mail}
                                        type="email"
                                        placeholder="Work Email"
                                        name="email"
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        error={errors.email}
                                        required
                                    />

                                    <div className="relative">
                                        <InputField
                                            icon={Lock}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Password"
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            error={errors.password}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <InputField
                                            icon={Lock}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm Password"
                                            name="confirmPassword"
                                            value={registerData.confirmPassword}
                                            onChange={handleRegisterChange}
                                            error={errors.confirmPassword}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            />
                                        ) : (
                                            <>
                                                Create Account
                                                <ChevronRight className="ml-2 w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            )}

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-slate-500">Or continue with SSO</span>
                                    </div>
                                </div>

                                <motion.button
                                    type="button"
                                    className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 group"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Shield className="w-5 h-5 mr-2 text-slate-600 group-hover:text-slate-800" />
                                    <span className="text-slate-700 group-hover:text-slate-900 font-medium">Enterprise SSO</span>
                                </motion.button>
                            </div>

                            <p className="text-center mt-6 text-sm text-slate-600">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                <button
                                    type="button"
                                    onClick={toggleMode}
                                    className="ml-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                                >
                                    {isSignUp ? 'Sign In' : 'Request Access'}
                                </button>
                            </p>

                            <p className="text-center mt-4 text-xs text-slate-500">
                                Need help? Contact your{' '}
                                <button type="button" className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer">IT administrator</button>
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Demo Credentials Modal */}
            <AnimatePresence>
                {showDemoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDemoModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-800">Select Demo Role</h3>
                                <button
                                    onClick={() => setShowDemoModal(false)}
                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-slate-600 mb-4">
                                Choose a user role to test different permissions and dashboard views
                            </p>

                            <div className="space-y-3 mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    User Role
                                </label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Select a role...</option>
                                    {getDemoRoles().map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>

                                {selectedRole && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                                    >
                                        {(() => {
                                            const role = getDemoRoles().find(r => r.value === selectedRole);
                                            return role ? (
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-semibold text-blue-900">{role.label}</span>
                                                    </div>
                                                    <div className="text-sm text-blue-700 mb-1">
                                                        <strong>Email:</strong> {role.email}
                                                    </div>
                                                    <div className="text-sm text-blue-700 mb-1">
                                                        <strong>Password:</strong> {role.password || 'demo123'}
                                                    </div>
                                                    <div className="text-sm text-blue-600">
                                                        <strong>Access:</strong> {role.description}
                                                    </div>
                                                </div>
                                            ) : null;
                                        })()}
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowDemoModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDemoSelection}
                                    disabled={!selectedRole || loading}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : (
                                        <span>Use Credentials</span>
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Demo Environment</p>
                                        <p className="text-xs text-yellow-700">These are test credentials for demonstration purposes only</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AuthPage;
