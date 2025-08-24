// Backend Connection Test
// This script tests if your Spring Boot backend is properly configured

const testBackendConnection = async () => {
    const API_BASE = 'http://localhost:8080/api';

    console.log('🔧 Testing Backend Connection...');

    // Test endpoints your frontend expects
    const endpoints = [
        '/demo/roles',
        '/demo/credentials/admin',
        '/demo/users',
        '/demo/departments',
        '/admin/employees/stats',
        '/admin/departments/stats'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`\n📡 Testing: ${API_BASE}${endpoint}`);

            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ SUCCESS: ${endpoint}`);
                console.log(`   Status: ${response.status}`);
                console.log(`   Data: ${JSON.stringify(data).substring(0, 100)}...`);
            } else {
                console.log(`❌ FAILED: ${endpoint}`);
                console.log(`   Status: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.log(`🚫 ERROR: ${endpoint}`);
            console.log(`   Error: ${error.message}`);
        }
    }

    console.log('\n🏁 Backend connection test completed!');
};

// Test CORS configuration
const testCORS = async () => {
    console.log('\n🌐 Testing CORS Configuration...');

    try {
        const response = await fetch('http://localhost:8080/api/demo/roles', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Content-Type',
            },
        });

        console.log('CORS Headers received:');
        console.log(`Access-Control-Allow-Origin: ${response.headers.get('Access-Control-Allow-Origin')}`);
        console.log(`Access-Control-Allow-Methods: ${response.headers.get('Access-Control-Allow-Methods')}`);
        console.log(`Access-Control-Allow-Credentials: ${response.headers.get('Access-Control-Allow-Credentials')}`);

    } catch (error) {
        console.log(`❌ CORS Test Failed: ${error.message}`);
    }
};

// Export for use in browser console or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testBackendConnection, testCORS };
} else {
    // Browser environment - make functions available globally
    window.testBackendConnection = testBackendConnection;
    window.testCORS = testCORS;
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
    console.log('🚀 Backend Test Script Loaded!');
    console.log('Run: testBackendConnection() to test your APIs');
    console.log('Run: testCORS() to test CORS configuration');
}
