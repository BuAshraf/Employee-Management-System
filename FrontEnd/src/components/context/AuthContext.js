import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth data on mount - sync with API system
    const storedToken = localStorage.getItem('token') || localStorage.getItem('ems_token');
    const storedUser = localStorage.getItem('user') || localStorage.getItem('ems_user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (storedToken && storedUser && isAuthenticated === 'true') {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        console.log('✅ AuthContext: User restored from localStorage:', userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear all auth data on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('ems_token');
        localStorage.removeItem('ems_user');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  // Simulate API calls
  const simulateAPICall = (delay = 1500) =>
    new Promise(resolve => setTimeout(resolve, delay));

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await simulateAPICall();

      // Simulate login validation
      if (email === 'admin@company.com' && password === 'admin123') {
        const userData = {
          id: '1',
          name: 'John Administrator',
          email: 'admin@company.com',
          employeeId: 'EMP001',
          department: 'IT',
          role: 'admin',
          isEmailVerified: true,
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        setUser(userData);
        setToken(mockToken);
        localStorage.setItem('ems_token', mockToken);
        localStorage.setItem('ems_user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');

        toast.success('Login successful!');
        return true;
      } else if (email === 'hr@company.com' && password === 'hr123') {
        const userData = {
          id: '2',
          name: 'Sarah HR Manager',
          email: 'hr@company.com',
          employeeId: 'EMP002',
          department: 'Human Resources',
          role: 'hr',
          isEmailVerified: true,
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        setUser(userData);
        setToken(mockToken);
        localStorage.setItem('ems_token', mockToken);
        localStorage.setItem('ems_user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');

        toast.success('Login successful!');
        return true;
      } else if (email.includes('@company.com') && password === 'employee123') {
        const userData = {
          id: '3',
          name: email.split('@')[0].replace('.', ' '),
          email,
          employeeId: 'EMP' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
          department: 'General',
          role: 'employee',
          isEmailVerified: true,
        };
        const mockToken = 'mock-jwt-token-' + Date.now();

        setUser(userData);
        setToken(mockToken);
        localStorage.setItem('ems_token', mockToken);
        localStorage.setItem('ems_user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');

        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      await simulateAPICall();

      // Simulate registration
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        employeeId: userData.employeeId,
        department: userData.department,
        role: 'employee',
        isEmailVerified: false,
      };

      // Store unverified user temporarily
      localStorage.setItem('pending_user', JSON.stringify(newUser));

      toast.success('Registration successful! Please verify your email with the OTP sent.');
      return true;
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    setIsLoading(true);
    try {
      await simulateAPICall(1000);

      // Simulate OTP verification (accept any 6-digit code)
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        const pendingUser = localStorage.getItem('pending_user');
        if (pendingUser) {
          const userData = JSON.parse(pendingUser);
          userData.isEmailVerified = true;

          const mockToken = 'mock-jwt-token-' + Date.now();
          setUser(userData);
          setToken(mockToken);

          localStorage.setItem('ems_token', mockToken);
          localStorage.setItem('ems_user', JSON.stringify(userData));
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.removeItem('pending_user');

          toast.success('Email verified successfully!');
          return true;
        }
      }

      toast.error('Invalid OTP. Please try again.');
      return false;
    } catch (error) {
      toast.error('OTP verification failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    try {
      await simulateAPICall(1000);

      // Simulate password reset request
      if (email.includes('@company.com')) {
        toast.success('Password reset link sent to your email!');
        return true;
      } else {
        toast.error('Email not found in our system.');
        return false;
      }
    } catch (error) {
      toast.error('Failed to send reset email.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    setIsLoading(true);
    try {
      await simulateAPICall();

      // Simulate password reset
      toast.success('Password reset successful! You can now login with your new password.');
      return true;
    } catch (error) {
      toast.error('Password reset failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email) => {
    setIsLoading(true);
    try {
      await simulateAPICall(1000);
      toast.success('OTP resent successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to resend OTP.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // Clear all authentication keys
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
    localStorage.removeItem('pending_user');
    localStorage.removeItem('isAuthenticated');
    toast.success('Logged out successfully');
  };

  // Function to sync authentication state with API system
  const syncAuthState = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (storedToken && storedUser && isAuthenticated === 'true') {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        console.log('✅ AuthContext synced with API authentication:', userData);
        return true;
      } catch (error) {
        console.error('❌ Error syncing auth state:', error);
        return false;
      }
    }
    return false;
  };

  // Periodically check for auth state changes (useful when login happens via console)
  useEffect(() => {
    const checkAuthInterval = setInterval(() => {
      if (!user) {
        syncAuthState();
      }
    }, 1000); // Check every second

    return () => clearInterval(checkAuthInterval);
  }, [user]);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    syncAuthState,
    verifyOTP,
    requestPasswordReset,
    resetPassword,
    resendOTP,
    isLoading,
    // Legacy compatibility
    isAuthenticated: !!user,
    loading: isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
