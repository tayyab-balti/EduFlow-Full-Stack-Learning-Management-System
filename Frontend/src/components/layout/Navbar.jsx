import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear(); // Clears token, role, and name
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to={role === "teacher" ? "/dashboard" : "/student-dashboard"}>
          LMS Portal
        </Link>
      </div>
      <div className="nav-links">
        <span className="user-welcome">
          Welcome, <strong>{name || "User"}</strong> ({role})
        </span>
        <button className="logout-btn-nav" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
