import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    let redirectPath = "/student-dashboard";

    // Check role to decide where to send the logged-in user

    if (role === "admin") redirectPath = "/admin-dashboard";
    else if (role === "teacher") redirectPath = "/dashboard";

    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
