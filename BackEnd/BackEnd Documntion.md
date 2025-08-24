# BackEnd Documntion

## Overview

This backend is a Spring Boot 3 application (Java 17, Gradle) that powers the EMS (Employee Management System). It exposes a REST API for employees, departments, finance, notifications, and system settings with JWT-secured endpoints and MySQL persistence.

## Tech stack

- Java 17
- Spring Boot 3.4.x (Web, Data JPA, Security, Actuator, Validation, Batch, Integration, WebSocket)
- MySQL 8 (Connector/J)
- JPA/Hibernate
- Gradle build tool

## Project layout

```text
BackEnd/
├─ build.gradle
├─ src/
│  ├─ main/
│  │  ├─ java/com/ems/ems_backend/
│  │  │  ├─ controller/        # REST controllers (Auth, Employee, Department, Finance, Admin, etc.)
│  │  │  ├─ service/           # Business services (EmployeeService, SystemSettingsService, ...)
│  │  │  ├─ repository/        # Spring Data repositories
│  │  │  ├─ model|entity/      # Domain models (if present)
│  │  │  ├─ config|security/   # Security & app configuration (if present)
│  │  │  └─ utils/             # Utilities (e.g., EmployeeIdGenerator)
│  │  └─ resources/
│  │     ├─ application.properties
│  │     └─ db/migration/create_system_settings_table.sql
│  └─ test/
│     └─ java/...              # JUnit tests
└─ gradlew / gradlew.bat / gradle-wrapper.jar
```

Key controllers detected:

- `AuthController` (/api/auth)
- `EmployeeRestController` (/api/employees)
- `DepartmentController` (/api/departments)
- `FinanceController` (/api/finance)
- `NotificationController` (/api/notifications)
- `SystemSettingsController` (/api/system-settings)
- `AdminController`, `SuperAdminController` (/api/admin, etc.)
- `ApiController` (/api/status)

## Build & run

- Dev run (Windows):

```powershell
# from BackEnd/
./gradlew.bat bootRun
```

- Dev run (macOS/Linux):

```bash
# from BackEnd/
./gradlew bootRun
```

- Build a runnable jar:

```bash
# from BackEnd/
./gradlew bootJar
# jar: build/libs/ems-backend-0.0.1-SNAPSHOT.jar
java -jar build/libs/ems-backend-0.0.1-SNAPSHOT.jar
```

Default ports:

- API: <http://localhost:8080>

## Configuration

Edit `src/main/resources/application.properties`:

```properties
spring.application.name=EMS Backend
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ems
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASS
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT (example keys; set real values via env or a secure config)
app.jwtSecret=change-me
app.jwtExpirationMs=86400000

# CORS (match your frontend origin)
app.cors.allowed-origins=http://localhost:3000
```

You can override these via environment variables or a profile-specific properties file.

## API overview

Base URL: `http://localhost:8080/api`

Common auth header:

```text
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Typical resources:

- Employees: `GET/POST /api/employees`, `GET/PUT/DELETE /api/employees/{id}`
- Departments: `GET/POST /api/departments`, `PUT/DELETE /api/departments/{id}`
- Finance: salary overview, budgets (`/api/finance/...`)
- Notifications: `/api/notifications/...`
- System settings: `/api/system-settings/...`
- Auth: `/api/auth/login` (returns JWT)

For detailed endpoints, see:

- `SYSTEM_SETTINGS_API_DOCUMENTATION.md`
- `POSTMAN_TESTING_GUIDE.md`
- `NOTIFICATION_SYSTEM_README.md`

## Security

- Spring Security with JWT (Bearer tokens).
- Role-based access across Admin/HR/Manager/Employee/etc.
- CORS configured for the frontend origin.

Ensure your frontend attaches the JWT to requests (e.g., Axios interceptor).

## Health & monitoring

- Spring Boot Actuator included.
- Health checks:
  - `GET /actuator/health`
  - Optional custom status: `GET /api/status`

## Database & migrations

- MySQL 8 via Connector/J.
- A migration SQL exists under `resources/db/migration/` for system settings.
  - If using Flyway/Liquibase, ensure the matching dependency and configuration are added; otherwise, manage schema separately.

## Testing

- Run tests:

```bash
./gradlew test
```

## Troubleshooting

- Port in use: change `server.port` or stop the conflicting process.
- DB connection errors: verify URL/credentials and MySQL is running.
- 401/403 responses: ensure valid JWT and appropriate roles.
- CORS errors: update `app.cors.allowed-origins` to match your frontend URL.

## Useful links

- Backend README: `BackEnd/README.md`
- System Settings API: `BackEnd/SYSTEM_SETTINGS_API_DOCUMENTATION.md`
- Notification System: `BackEnd/NOTIFICATION_SYSTEM_README.md`
- Postman Testing: `BackEnd/POSTMAN_TESTING_GUIDE.md`
