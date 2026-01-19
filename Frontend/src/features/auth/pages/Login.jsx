import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import LoadingButton from "../../../components/ui/LoadingButton";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordBtn, setShowPasswordBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Prevent double login
  const [userRole, setUserRole] = useState(null); // single source of truth

  useEffect(() => {
    if (!userRole) return;

    if (userRole === "admin") navigate("/admin-dashboard");
    else if (userRole === "teacher") navigate("/teacher-dashboard");
    else navigate("/student-dashboard");
  }, [userRole, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    if (name === "password") {
      setShowPasswordBtn(value.length > 0);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLoading) return; // prevent multiple clicks

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const normalizedPassword = credentials.password;

    if (!normalizedEmail || !normalizedPassword) {
      return toast.error("Email and password are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return toast.error("Please enter a valid email address");
    }

    setIsLoading(true); // Start loading ONLY before API call

    try {
      const payload = {
        email: normalizedEmail,
        password: normalizedPassword,
      };

      const response = await api.post("/auth/login", payload);

      // Multi-role Navigation Logic
      const role = response.data.user.role;
      // console.log(response.data);

      // Store data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("userName", response.data.user.name);

      toast.success(response.data.message || "Login successful");

      setUserRole(role);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
      setCredentials({ email: "", password: "" });
      setIsLoading(false); // only reset loading if error
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <fieldset disabled={isLoading}>
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

          <LoadingButton type="submit" isLoading={isLoading}>
            Login
          </LoadingButton>
        </fieldset>

        <div className="link">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
