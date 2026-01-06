import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    // Check role to decide where to send the logged-in user
    return (
      <Navigate
        to={role === "teacher" ? "/dashboard" : "/student-dashboard"}
        replace
      />
    );
  }

  return children;
};

export default PublicRoute;
