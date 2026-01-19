# LMS Project

It's a full-featured LMS with authentication, authorization, file uploads, and role-based access control

## Project Structure

- **/frontend**: React/ client side.
- **/backend**: Node.js/Express API.

## Getting Started

### 1. Backend Setup

1. `cd backend`
2. `npm install`
3. Create a `.env` file
4. `npm start`

### 2. Frontend Setup

1. `cd frontend`
2. `npm install`
3. `npm start`

### 3. Project Architecture

**LMS Project:**
```
├── Backend (Node.js + Express API)
│   ├── config/          # Database & configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Authentication, Authorization, Error handling
│   ├── models/          # Database schemas (MongoDB)
│   ├── routes/          # API endpoints
│   ├── uploads/         # File storage
│   └── utils/           # Helper functions
│
└── Frontend (React + Vite)
    ├── components/      # Reusable UI components
    ├── features/        # Feature-based organization
    ├── routes/          # Routing logic
    └── services/        # API calls
```

### 4. Features (`features/`)

**Feature-Based Organization:**
```
features/
├── auth/
│   └── pages/ (Login, Signup, Home)
├── students/
│   ├── components/ (StudentCard, StudentForm, StudentList)
│   └── pages/ (StudentDashboard)
├── teachers/
│   └── pages/ (TeacherDashboard)
└── admin/
    └── pages/ (AdminDashboard)
```

