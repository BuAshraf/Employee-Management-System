# 🚀 Employee Management System (EMS) - Complete Integration Guide

## 📋 Project Overview

**Full-Stack Employee Management System** with React frontend and Spring Boot backend, featuring comprehensive role-based access control, department management, and real-time analytics.

---

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│  React Frontend │ ◄─────────────► │ Spring Boot API │
│   (Port 3000)   │                 │   (Port 8080)   │
└─────────────────┘                 └─────────────────┘
        │                                     │
        ▼                                     ▼
┌─────────────────┐                 ┌─────────────────┐
│  Browser UI     │                 │   MySQL 8 DB    │
│  Admin Panel    │                 │   JPA/Hibernate │
└─────────────────┘                 └─────────────────┘
```

---

## 🔧 Technology Stack

### **Frontend (React)**
- **Framework**: React 19.1.0
- **Routing**: React Router DOM
- **Styling**: Bootstrap 5 + Tailwind CSS
- **Icons**: Lucide React + FontAwesome
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Authentication**: JWT Token-based
- **Notifications**: React Hot Toast

### **Backend (Spring Boot)**
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT
- **Database**: MySQL 8
- **ORM**: JPA/Hibernate
- **Architecture**: RESTful API
- **CORS**: Configured for localhost:3000

---

## 🚀 Quick Start

### **Prerequisites**
```bash
# Required Software
- Node.js 18+
- Java 17+
- MySQL 8
- Git
```

### **1. Clone & Setup**
```bash
# Clone repository
git clone <your-repo-url>
cd Employee-Management-System

# Frontend setup
cd FrontEnd
npm install
npm start  # Runs on http://localhost:3000

# Backend setup (separate terminal)
cd ../BackEnd
./gradlew bootRun  # Runs on http://localhost:8080
```

### **2. Database Configuration**
```properties
# application.properties
spring.application.name=EMS Backend
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔐 Authentication System

### **Role-Based Access Control**
| Role | Code | Permissions | Access Level |
|------|------|-------------|--------------|
| 👑 Admin | `ROLE_ADMIN` | Full System Access | All operations |
| 👥 HR | `ROLE_HR` | Employee Lifecycle | Create/Edit employees |
| 📊 Manager | `ROLE_MANAGER` | Team Management | Reports & team data |
| 👤 Employee | `ROLE_EMPLOYEE` | Personal Profile | Own data only |
| 🏢 Dept Head | `ROLE_DEPARTMENT_HEAD` | Department Control | Department-specific |
| 💰 Finance | `ROLE_FINANCE_MANAGER` | Financial Data | Salary & budget access |
| 🔧 IT Support | `ROLE_IT_SUPPORT` | System Maintenance | Technical operations |

### **Demo Credentials**
```javascript
// Available for testing
{
  admin: { email: "admin@ems.com", password: "admin123" },
  hr: { email: "hr@ems.com", password: "hr123" },
  manager: { email: "manager@ems.com", password: "manager123" },
  employee: { email: "employee@ems.com", password: "employee123" },
  depthead: { email: "depthead@ems.com", password: "depthead123" },
  finance: { email: "finance@ems.com", password: "finance123" },
  itsupport: { email: "itsupport@ems.com", password: "itsupport123" }
}
```

### **🔒 Owner Account (Hidden)**
```javascript
// Super Admin - Hidden from all listings
{
  username: "BuAshraf",
  password: "Mukulaib@Ems",
  email: "owner@ems.internal",
  role: "SUPER_ADMIN",
  note: "Completely hidden from UI, has all permissions"
}
```

---

## 🌐 API Documentation

### **Base URL**
```
Backend: http://localhost:8080
Frontend: http://localhost:3000
```

### **Authentication Endpoints**
```http
POST /api/auth/login
Content-Type: application/json
{
  "email": "admin@ems.com",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "email": "admin@ems.com",
  "role": "ROLE_ADMIN"
}
```

### **Protected Endpoints**
```http
# Headers for all protected requests
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### **Employee Management**
```http
GET    /api/employees              # List all employees
GET    /api/employees/{id}         # Get employee by ID
POST   /api/employees              # Create new employee
PUT    /api/employees/{id}         # Update employee
DELETE /api/employees/{id}         # Delete employee
GET    /api/employees/profile      # Current user profile
```

### **Department Management**
```http
GET    /api/departments            # List all departments
POST   /api/departments            # Create department
PUT    /api/departments/{id}       # Update department
DELETE /api/departments/{id}       # Delete department
PUT    /api/departments/{deptId}/head/{empId}  # Assign dept head
```

### **Finance Management**
```http
GET    /api/finance/salary-overview    # Salary statistics
GET    /api/finance/budget            # Budget information
POST   /api/finance/budget/allocate   # Allocate budget
PUT    /api/finance/salaries/bulk-update  # Bulk salary updates
```

### **Demo Data (Public)**
```http
GET /api/demo/roles               # Available roles
GET /api/demo/credentials/{role}  # Demo login credentials
GET /api/demo/users              # Demo users (owner filtered out)
GET /api/demo/departments        # Demo departments
```

### **System Status**
```http
GET /api/status                  # API status and health
GET /api/health                  # System health check
```

---

## 🎨 Frontend Architecture

### **Component Structure**
```
src/
├── components/
│   ├── auth/          # Authentication components
│   │   ├── AuthPage.jsx
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── ProtectedRoute.jsx
│   ├── admin/         # Admin control panel
│   │   ├── AdminControlPanel.js
│   │   └── AdminDashboardWidget.js
│   ���── employee/      # Employee management
│   │   ├── EmployeeList.js
│   │   ├── AddEmployee.js
│   │   ├── UpdateEmployee.js
│   │   └── EmployeeDetails.js
│   ├── department/    # Department components
│   │   └── DepartmentList.js
│   ├── layout/        # Navigation & layout
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── PageHeader.js
│   ├── dashboard/     # Analytics & reporting
│   │   └── Dashboard.js
│   └── pages/         # Main pages
│       ├── Home.js
│       ├── Settings.js
│       └── Reports.js
├── context/
│   └── AuthContext.js # Global authentication state
├── services/
│   ├── AuthService.js # Authentication API
│   ├── AdminService.js # Admin operations API
│   └── EmployeeService.js # Employee operations API
└── utils/
    ├── api.js         # Axios configuration
    └── lazyLoad.js    # Component lazy loading
```

### **Key Features**
- 🔒 **JWT Authentication** with automatic token refresh
- 🛡️ **Protected Routes** based on user roles
- 🎯 **Admin Control Panel** for system management
- 📊 **Real-time Analytics** with fallback data
- 🌍 **Multi-timezone Support** (400+ timezones)
- 💱 **SAR Currency** integration
- 📱 **Responsive Design** (Bootstrap + Tailwind)
- 🔄 **Auto-refresh** for live data updates

---

## 🛡️ Security Configuration

### **CORS Setup**
```java
@Configuration
public class SecurityConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization"));
        configuration.setAllowCredentials(true);
        return source;
    }
}
```

### **JWT Security**
```java
// Role hierarchy
ADMIN > HR > FINANCE_MANAGER > DEPARTMENT_HEAD > MANAGER > EMPLOYEE > IT_SUPPORT
```

### **Frontend API Configuration**
```javascript
// src/utils/api.js
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📊 Admin Control Panel Features

### **Dashboard Widgets**
- 👥 **Employee Statistics** (Total, Active, By Role)
- 🏢 **Department Overview** (Count, Budget, Heads)
- 💰 **Financial Summary** (Payroll, Budget allocation)
- 📈 **Performance Metrics** (Growth, Trends)

### **Management Functions**
```javascript
// Department Management
- Create/Edit/Delete departments
- Assign department heads
- Budget allocation and tracking
- Employee assignment

// Employee Management  
- CRUD operations for all employees
- Role assignment and permissions
- Salary management
- Performance tracking

// System Administration
- User role management
- Security settings
- Audit logs
- System configuration
```

### **Access Control**
```javascript
// Route Protection Example
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminControlPanel />
  </ProtectedRoute>
} />
```

---

## 🔧 Configuration Files

### **Frontend Configuration**
```json
// package.json (key dependencies)
{
  "name": "ems-frontend",
  "version": "0.1.0",
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.7.0",
    "axios": "^1.9.0",
    "bootstrap": "^5.3.6",
    "framer-motion": "^12.23.7",
    "lucide-react": "^0.525.0",
    "react-hot-toast": "^2.5.2",
    "timezones-list": "^3.0.1"
  }
}
```

### **Backend Configuration**
```properties
# application.properties
spring.application.name=EMS Backend
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
app.jwtSecret=mySecretKey
app.jwtExpirationMs=86400000

# CORS Configuration
app.cors.allowed-origins=http://localhost:3000
```

---

## 🚀 Deployment

### **Development Environment**
```bash
# Terminal 1 - Frontend
cd FrontEnd
npm install
npm start
# Accessible at: http://localhost:3000

# Terminal 2 - Backend  
cd BackEnd
./gradlew clean build
./gradlew bootRun
# Accessible at: http://localhost:8080
```

### **Production Build**
```bash
# Frontend production build
cd FrontEnd
npm run build
# Creates optimized build in build/ folder

# Backend JAR creation
cd BackEnd
./gradlew clean build -x test
# Creates JAR in build/libs/ folder

# Run production
java -jar build/libs/ems-backend-0.0.1-SNAPSHOT.jar
```

---

## 🧪 Testing

### **API Testing**
```bash
# Test authentication
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ems.com","password":"admin123"}'

# Test demo endpoints (no auth)
curl http://localhost:8080/api/demo/roles
curl http://localhost:8080/api/demo/credentials/admin

# Test protected endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/employees
```

### **Frontend Testing**
```bash
# Start frontend and test
npm start
# Visit: http://localhost:3000
# Try demo login credentials
# Test admin panel access
```

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. CORS Errors**
```javascript
// Solution: Verify backend CORS configuration
@CrossOrigin(origins = "http://localhost:3000")

// Check browser console for specific CORS error
// Ensure credentials are properly configured
```

#### **2. Authentication Issues**
```javascript
// Check token storage
console.log(localStorage.getItem('token'));

// Verify API headers
const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

#### **3. Database Connection**
```sql
-- Verify MySQL connection
SHOW DATABASES;
USE ems;
SHOW TABLES;
DESCRIBE users;
DESCRIBE employees;
```

#### **4. Port Conflicts**
```bash
# Check what's running on ports
netstat -an | findstr ":3000"
netstat -an | findstr ":8080"

# Kill processes if needed (Windows)
taskkill /PID <process_id> /F
```

---

## 📈 Current Status

### ✅ **Fully Working**
- ✅ Authentication system (JWT)
- ✅ Admin control panel UI
- ✅ Department management (CRUD)
- ✅ Demo data integration
- ✅ Role-based access control
- ✅ Frontend-backend communication
- ✅ CORS configuration
- ✅ Protected routing
- ✅ Owner account (hidden super admin)

### ⚠️ **Partial Implementation**
- ⚠️ Employee CRUD (needs testing)
- ⚠️ Finance management (basic implementation)
- ⚠️ Advanced analytics (fallback data working)
- ⚠️ Salary management (endpoints exist)

### 🔄 **In Progress**
- 🔄 Complete API endpoint testing
- 🔄 Advanced reporting features
- 🔄 Email notification system
- 🔄 File upload functionality

---

## 🎯 Quick Test Commands

```bash
# 1. Start Backend
cd BackEnd
./gradlew bootRun

# 2. Test API Status
curl http://localhost:8080/api/status

# 3. Test Demo Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ems.com","password":"admin123"}'

# 4. Start Frontend (separate terminal)
cd FrontEnd
npm start

# 5. Test in Browser
# Visit: http://localhost:3000
# Login with demo credentials
# Access admin panel
```

---

## 📞 Support

### **Getting Help**
- 📧 **Email**: admin@ems.com
- 🐛 **Issues**: Create GitHub issue
- 📖 **Documentation**: Check API_DOCUMENTATION.md
- 💬 **Questions**: Use demo credentials to test system

### **FAQ**
**Q: How do I reset admin password?**
A: Use the hidden owner account (BuAshraf/Mukulaib@Ems) to manage other accounts.

**Q: Can I change the default port?**
A: Yes, modify `server.port` in application.properties for backend.

**Q: How do I access the owner account?**
A: Login with username "BuAshraf" and password "Mukulaib@Ems" - it has super admin privileges.

---

**Built with ❤️ for efficient employee management**

---

*Last Updated: July 24, 2025*  
*Version: 1.0.0*  
*Status: Active Development*
