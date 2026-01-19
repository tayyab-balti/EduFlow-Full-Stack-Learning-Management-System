import { lazy } from "react";

export const Home = lazy(() => import("../features/auth/pages/Home"));
export const Signup = lazy(() => import("../features/auth/pages/Signup"));
export const Login = lazy(() => import("../features/auth/pages/Login"));
export const TeacherDashboard = lazy(() =>
  import("../features/teachers/pages/TeacherDashboard")
);
export const StudentDashboard = lazy(() =>
  import("../features/students/pages/StudentDashboard")
);
export const AdminDashboard = lazy(() => import("../features/admin/pages/AdminDashboard"));