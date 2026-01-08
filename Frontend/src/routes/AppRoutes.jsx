import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../features/admin/pages/AdminDashboard";

const Home = lazy(() => import("../features/auth/pages/Home"));
const Signup = lazy(() => import("..//features/auth/pages/Signup"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const TeacherDashboard = lazy(() =>
  import("../features/teachers/pages/TeacherDashboard")
);
const StudentDashboard = lazy(() =>
  import("../features/students/pages/StudentDashboard")
);

const AppRoutes = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="suspense-container">
            <div className="spinner"></div>
            <p>Loading experience...</p>
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
