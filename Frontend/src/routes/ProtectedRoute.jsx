import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || !userRole) return <Navigate to="/login" />;

  // If a specific role is required and doesn't match
  if (allowedRole && userRole !== allowedRole) {
    let redirectPath = "/student-dashboard"; // Default fallback

    if (userRole === "admin") redirectPath = "/admin-dashboard";
    else if (userRole === "teacher") redirectPath = "/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
