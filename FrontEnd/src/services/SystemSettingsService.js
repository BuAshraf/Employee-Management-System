import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class SystemSettingsService {
    constructor() {
        this.api = axios.create({
            baseURL: `${API_URL}/settings`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Get all system settings
     * @returns {Promise} API response with system settings
     */
    async getSystemSettings() {
        try {
            const response = await this.api.get('/system');
            return response.data;
        } catch (error) {
            console.error('Error fetching system settings:', error);
            throw error;
        }
    }

    /**
     * Update system settings
     * @param {Object} settings - The settings object to save
     * @returns {Promise} API response
     */
    async updateSystemSettings(settings) {
        try {
            const response = await this.api.put('/system', settings);
            return response.data;
        } catch (error) {
            console.error('Error updating system settings:', error);
            throw error;
        }
    }

    /**
     * Get specific setting by key
     * @param {string} key - Setting key
     * @returns {Promise} API response with setting value
     */
    async getSetting(key) {
        try {
            const response = await this.api.get(`/system/${key}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching setting ${key}:`, error);
            throw error;
        }
    }

    /**
     * Update specific setting
     * @param {string} key - Setting key
     * @param {any} value - Setting value
     * @returns {Promise} API response
     */
    async updateSetting(key, value) {
        try {
            const response = await this.api.put(`/system/${key}`, { value });
            return response.data;
        } catch (error) {
            console.error(`Error updating setting ${key}:`, error);
            throw error;
        }
    }

    /**
     * Reset settings to default values
     * @returns {Promise} API response
     */
    async resetSettings() {
        try {
            const response = await this.api.post('/system/reset');
            return response.data;
        } catch (error) {
            console.error('Error resetting settings:', error);
            throw error;
        }
    }

    /**
     * Test email configuration
     * @param {Object} emailConfig - Email configuration object
     * @returns {Promise} API response
     */
    async testEmailConfiguration(emailConfig) {
        try {
            const response = await this.api.post('/system/test-email', emailConfig);
            return response.data;
        } catch (error) {
            console.error('Error testing email configuration:', error);
            throw error;
        }
    }

    /**
     * Send test email
     * @param {string} testEmail - Email address to send test email to
     * @returns {Promise} API response
     */
    async sendTestEmail(testEmail) {
        try {
            const response = await this.api.post('/system/send-test-email', { testEmail });
            return response.data;
        } catch (error) {
            console.error('Error sending test email:', error);
            throw error;
        }
    }

    /**
     * Create manual backup
     * @returns {Promise} API response
     */
    async createManualBackup() {
        try {
            const response = await this.api.post('/system/backup');
            return response.data;
        } catch (error) {
            console.error('Error creating manual backup:', error);
            throw error;
        }
    }

    /**
     * Clear system cache
     * @returns {Promise} API response
     */
    async clearCache() {
        try {
            const response = await this.api.post('/system/clear-cache');
            return response.data;
        } catch (error) {
            console.error('Error clearing cache:', error);
            throw error;
        }
    }

    /**
     * Get system information
     * @returns {Promise} API response with system info
     */
    async getSystemInfo() {
        try {
            const response = await this.api.get('/system/info');
            return response.data;
        } catch (error) {
            console.error('Error fetching system info:', error);
            throw error;
        }
    }
}

// Export a singleton instance
const systemSettingsService = new SystemSettingsService();
export default systemSettingsService;
