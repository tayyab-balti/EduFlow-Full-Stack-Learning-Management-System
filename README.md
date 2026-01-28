# 🎓 EduFlow – Full Stack Learning Management System (MERN)

EduFlow is a **full-stack Learning Management System (LMS)** built using the **MERN stack**.  
It supports **role-based authentication**, **email automation**, **dashboard management**, and **secure user handling** for Admins, Teachers, and Students.

This project was developed as part of my **6-month MERN Stack training** to demonstrate real-world full-stack application architecture and workflows.

---

## 🚀 Live Features Overview

### 👤 User Roles
- Admin  
- Teacher  
- Student  

Each role has dedicated permissions and dashboards.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure signup/login using JWT authentication  
- Role-based access control (Admin / Teacher / Student)  
- Protected routes on both frontend and backend  

### 👨‍🏫 Teacher Module
- Teacher signup and login  
- Add students using a form  
- Automatically send student login credentials via email  
- View assigned students  

### 👨‍🎓 Student Module
- Student login using emailed credentials  
- View personal profile and details  
- Upload and update profile picture  
- Secure access to student dashboard  

### 🛠️ Admin Dashboard
- View all registered teachers and students  
- Delete any student from the system  
- When a student is deleted:  
  - A popup notification is shown on the student dashboard  
  - The student is automatically logged out (session invalidation)  

### 📩 Email Automation
- Automatically sends login credentials to students upon creation  
- Improves onboarding flow and system usability  

---

## 🧱 Tech Stack

### Frontend
- React.js (Vite)  
- JavaScript (ES6+)  
- HTML5, CSS3  
- Axios  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- Nodemailer (Email Service)  

### Tools
- Git & GitHub  
- Postman  
- VS Code  

---

## 🗂️ Project Architecture

```text
├── Backend (Node.js + Express)
│   ├── config/          # Database & environment configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, role checks, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # REST API endpoints
│   ├── uploads/         # File uploads (profile images)
│   └── utils/           # Helper utilities
│
└── Frontend (React + Vite)
    ├── components/      # Reusable UI components
    ├── features/        # Feature-based modules
    ├── routes/          # Application routing
    └── services/        # API integrations
````

---

## 🧩 Feature-Based Frontend Structure

```text
features/
├── auth/
│   └── pages/           # Login, Signup, Home
├── students/
│   ├── components/      # StudentCard, StudentForm, StudentList
│   └── pages/           # StudentDashboard
├── teachers/
│   └── pages/           # TeacherDashboard
└── admin/
    └── pages/           # AdminDashboard
```

---

## ⚙️ Getting Started (Local Setup)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

Start the backend server:

```bash
npm start
```

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 📌 What This Project Demonstrates

* End-to-end MERN stack development
* Real-world authentication & authorization
* Role-based dashboards
* RESTful API design
* Frontend–backend integration
* Clean, scalable folder structure
* Practical problem-solving beyond tutorials

---

## 👨‍💻 Author

**Syed Tayyab**
MERN Stack Developer

* 📫 Email: [smtayyab110@gmail.com](mailto:smtayyab110@gmail.com)
* 🔗 LinkedIn: [https://www.linkedin.com/in/syed-tayyab-kazmi/](https://www.linkedin.com/in/syed-tayyab-kazmi/)
* 🐙 GitHub: [https://github.com/tayyab-balti](https://github.com/tayyab-balti)

---

⭐ If you find this project useful, feel free to star the repository!

```

---

You’re doing *everything right* now — this is how real hiring prep looks 💪
```
