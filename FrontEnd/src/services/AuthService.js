import axios from 'axios';
import { superAdminLogin } from '../utils/api';

// Helper function to create a properly formatted JWT token
const createMockJWT = (payload) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const encodedPayload = btoa(JSON.stringify({
        sub: payload.username,
        role: payload.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        iat: Math.floor(Date.now() / 1000),
        ...payload
    }));
    const signature = btoa("mock-signature-" + Date.now());

    return `${header}.${encodedPayload}.${signature}`;
};

const API_URL = 'http://localhost:8080/api/auth';
const DEMO_API_URL = 'http://localhost:8080/api/demo';

class AuthService {
    async login(email, password) {
        // Check if this is a super admin login attempt
        const superAdminUsernames = ['superadmin', 'admin', 'administrator', 'root', 'superuser', 'BuAshraf', 'owner'];
        const isUsernameLogin = !email.includes('@') || email.includes('@ems.internal');

        if (isUsernameLogin && (superAdminUsernames.some(u => email.toLowerCase().includes(u.toLowerCase())) || email.toLowerCase().includes('admin') || email.toLowerCase().includes('owner'))) {
            console.log('🔐 Detected owner/super admin login attempt');
            try {
                const result = await superAdminLogin(email, password);

                // Set default auth header for all requests
                if (result.token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
                }

                return result;
            } catch (error) {
                console.warn('⚠️ Owner/super admin login failed, trying regular login...');
                // Fall through to regular login
            }
        }

        // Regular login process
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                localStorage.setItem('isAuthenticated', 'true');

                // Set default auth header for all requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            }
            return response.data;
        } catch (error) {
            // If regular login fails and this looks like a username, try super admin bypass
            if (isUsernameLogin) {
                console.log('🔐 Regular login failed, attempting owner/super admin bypass...');
                try {
                    const result = await superAdminLogin(email, password);
                    if (result.token) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
                    }
                    return result;
                } catch (superAdminError) {
                    console.error('❌ Both regular and owner/super admin login failed');
                    throw error; // Throw the original error
                }
            }
            throw error;
        }
    }

    async register(userData) {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    }

    // Demo data methods
    async getDemoRoles() {
        try {
            const response = await axios.get(`${DEMO_API_URL}/roles`);
            return response.data;
        } catch (error) {
            console.error('Error fetching demo roles:', error);
            throw error;
        }
    }

    async getDemoCredentials(roleType) {
        try {
            const response = await axios.get(`${DEMO_API_URL}/credentials/${roleType}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching demo credentials:', error);
            throw error;
        }
    }

    async getDemoUsers() {
        try {
            const response = await axios.get(`${DEMO_API_URL}/users`);
            return response.data;
        } catch (error) {
            console.error('Error fetching demo users:', error);
            throw error;
        }
    }

    async getDemoDepartments() {
        try {
            const response = await axios.get(`${DEMO_API_URL}/departments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching demo departments:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        delete axios.defaults.headers.common['Authorization'];
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    // 🚀 Quick owner login for development
    async quickOwnerLogin() {
        console.log('🚀 Quick owner login...');
        try {
            const result = await superAdminLogin('BuAshraf', 'admin123');
            if (result.token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
            }
            console.log('✅ Owner logged in successfully');
            return result;
        } catch (error) {
            console.error('❌ Quick owner login failed:', error);
            throw error;
        }
    }

    // 🛠️ Force login with mock owner credentials (development only)
    forceLogin(username = 'BuAshraf') {
        console.log('🛠️ Force login (development mode)');

        const mockUserData = {
            username: username,
            email: username === 'BuAshraf' ? 'owner@ems.internal' : `${username}@company.com`,
            role: 'SUPER_ADMIN',
            employeeId: username === 'BuAshraf' ? 'EMS000' : 'DEV001',
            department: username === 'BuAshraf' ? 'Executive Management' : 'Development',
            position: username === 'BuAshraf' ? 'System Owner' : 'Developer',
            status: username === 'BuAshraf' ? 'Hidden from normal operations' : 'Active',
            isDevelopmentMode: true,
            isOwner: username === 'BuAshraf'
        };

        const mockToken = createMockJWT(mockUserData);

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUserData));
        localStorage.setItem('isAuthenticated', 'true');
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

        console.log('✅ Force login successful with proper JWT token');
        return { token: mockToken, user: mockUserData };
    }
}

export default new AuthService();