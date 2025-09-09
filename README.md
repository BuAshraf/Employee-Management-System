# <p align="center">Employee Management System (EMS)</p>

<p align="center">
  <img src="https://github.com/BuAshraf/Employee-Management-System/blob/main/assets/EMS_logo.jpg" height="260">
</p>

<p align="center">
  <a href="https://github.com/BuAshraf/Employee-Management-System"><img alt="Repo Stars" src="https://img.shields.io/github/stars/BuAshraf/Employee-Management-System?style=for-the-badge"></a>
  <a href="https://github.com/BuAshraf/Employee-Management-System/blob/main/LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/BuAshraf/Employee-Management-System?style=for-the-badge"></a>
  <a href="https://github.com/BuAshraf/Employee-Management-System/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/BuAshraf/Employee-Management-System?style=for-the-badge"></a>
</p>

<p align="center">
  <img alt="Java" src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white"/>
  <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img alt="Spring Boot" src="https://img.shields.io/badge/springboot-6DB33F.svg?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img alt="MySQL" src="https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white"/>
  <img alt="Apache POI" src="https://img.shields.io/badge/apache%20poi-%23D42029.svg?style=for-the-badge&logo=apache&logoColor=white"/>
  <img alt="Bootstrap" src="https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white"/>
</p>

---

## 📜 Overview
The **Employee Management System (EMS)** is a **full-stack web application** designed to streamline the management of employee data. It allows you to add, view, update, search, and delete employee records with ease. The project features a Java Spring Boot backend (REST API), a React.js frontend, and file/database persistence for robust data management.

---

## 🎥 Demo
<p align="center">
 <video src="assets/Review_EMS.mp4" controls width="600"></video>
</p>

---

## 🚀 Features
- Company management: Add, view, update, and delete companies  
- CompanyKey-based login for secure multi-company data separation  
- Add new employees with unique IDs  
- View, search, and filter employees  
- Update employee details (name, department, salary, etc.)  
- Delete employee records  
- Full CRUD operations via REST API  
- File persistence with Excel (Java/POI) or MySQL (Spring Data JPA)  
- Clean code architecture (SOLID principles)  
- Modern, responsive frontend with React and Bootstrap  
- Company management UI (CompanyPage) and sidebar navigation  

---

## 🔧 Technologies Used
- **Backend:** Java 17, Spring Boot, Gradle, MySQL, MapStruct, Apache POI (Excel/DB), REST API, validation, role-based auth  
- **Frontend:** React.js, MUI, Bootstrap, Axios, React Router, modular services/components  
- **Dev Tools:** Git & GitHub, VS Code/IntelliJ/Eclipse  

---

## 🔍 Usage
1. **Start** the backend and frontend servers.  
2. Use the **web interface** to manage companies and employees:  
   - Add, view, search, update, or delete companies and employees.  
   - Login with companyKey to access company-specific data.  
3. **Data storage**:  
   Data is saved to **Excel** or **MySQL**, depending on your backend configuration.  

---

## 💼 Installation & Setup
### Prerequisites
- **Java 17** or later  
- **Node.js** & **npm**  
- **Gradle** (recommended for backend)  
- **IDE:** IntelliJ IDEA, Eclipse, VS Code, or similar  

### Steps
#### 1. Clone the Repository
```bash
git clone https://github.com/BuAshraf/EMS-Employee-Management-System.git
cd EMS-Employee-Management-System
```

#### Backend Setup
```bash
cd BackEnd
# If Maven:
mvn clean install
# OR If Gradle:
./gradlew build
```

#### Frontend Setup
```bash
cd ../FrontEnd
npm install
npm start
```

Access the app at: `http://localhost:3000`

---

### 📂 Folder Structure
```bash
Employee-Management-System/
├── BackEnd/
│   ├── build.gradle
│   ├── gradlew
│   ├── gradlew.bat
│   ├── settings.gradle
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   │       └── java/
├── FrontEnd/
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
├── README.md
├── SDLC.md
└── LICENSE
```

---

## 🔮 Future Work
- **Authentication & Security**  
  - Firebase Authentication (Email/Password; optional OAuth).  
  - Custom Claims for RBAC (Owner, Super Admin, Admin, HRM, HR, FCM/FC, Employee).  
  - Security Rules (Firestore/Storage) enforced per role.  
  - Verify ID tokens (JWT) in Spring Boot via Firebase Admin SDK.  
  - Session refresh, password strength checks, token rotation, audit logs.  

- **JWT & RBAC Enhancements**  
  - JWT (access + refresh) via Spring Security filters; BCrypt passwords.  
  - @PreAuthorize for API role protection.  
  - Protected Routes in React; UI hides unauthorized actions.  
  - Least Privilege + Deny by Default.  
  - Rate Limiting & Account Lockout.  
  - Audit Logs, CORS/CSRF hardening, HttpOnly refresh cookies.  

- **Deployment**  
  - Frontend hosting 
  - Backend deployment  
  - Database hosting   
  - Containerized deployment 
  - CI/CD pipelines with **GitHub Actions** for automated testing & deployment.  

- **Other Improvements**  
  - Advanced dashboards with charts & analytics.  
  - Export/Import employees via Excel/CSV.  
  - Multi-language support (English/Arabic).  
  - CI/CD improvements and Docker Compose for unified setup.  


---

## 🌐 Acknowledgements
- [Arjun Gautam](https://github.com/arjungautam1) & [CodeWithArjun YouTube](https://www.youtube.com/@CodeWithArjun)  
- **Apache POI Team** (Excel)  
- **Spring Boot** & **React** communities  

---

## ✉ License
This project is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.  

---

## 📖 Additional Documentation
- [Project SDLC Documentation](./SDLC.md): Full Software Development Life Cycle documentation for EMS  

---

## 💬 Get to Know Me 😁 👨‍💻
- 💼 **LinkedIn:** [Connect with me](https://www.linkedin.com/in/muhammed-alkulaib-773492238)  
- ✖ **Twitter:** [Follow me](https://twitter.com/bo_ashraf)  
- 📬 **Email:** [muhammedalmugera21@gmail.com](mailto:muhammedalmugera21@gmail.com)  
