import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBtn, setShowPasswordBtn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    if (name === "password") {
      setShowPasswordBtn(value.length > 0);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const normalizedPassword = credentials.password;

    if (!normalizedEmail || !normalizedPassword) {
      return toast.error("Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return toast.error("Please enter a valid email address");
    }

    // Inside Login.jsx -> handleLogin function

    try {
      const response = await api.post("/auth/login", credentials);

      // Store data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("userName", response.data.user.name);

      toast.success(response.data.message || "Login successful");

      // Multi-role Navigation Logic
      const role = response.data.user.role;

      if (role === "admin") {
        navigate("/admin-dashboard"); // Make sure this route exists in App.jsx
      } else if (role === "teacher") {
        navigate("/dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
      setCredentials({ email: "", password: "" });
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
        />

        <div className="password-input-container">
          <input
            className="password-input"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPasswordBtn ? (showPassword ? "Hide" : "Show") : ""}
          </button>
        </div>

        <button type="submit">Login</button>

        <div className="link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
