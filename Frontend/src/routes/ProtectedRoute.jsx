import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  // If a specific role is required and doesn't match, send them home
  if (allowedRole && userRole !== allowedRole) {
    return (
      <Navigate
        to={userRole === "teacher" ? "/dashboard" : "/student-dashboard"}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
