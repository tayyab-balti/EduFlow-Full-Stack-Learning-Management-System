import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

function Signup() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showPasswordBtn, setShowPasswordBtn] = useState(false);
  const [showConfirmPasswordBtn, setShowConfirmPasswordBtn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "password":
        setShowPasswordBtn(value.length > 0);
        break;

      case "confirmPassword":
        setShowConfirmPasswordBtn(value.length > 0);
        break;

      default:
        break;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const name = teacher.name.trim();
    const email = teacher.email.trim().toLowerCase();
    const password = teacher.password;
    const confirmPassword = teacher.confirmPassword;
    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

    if (!name || !email || !password) {
      return toast.error("All fields must be filled");
    }

    if (name.length < 3 || name.length > 20) {
      return toast.error("Name must be between 3 and 50 characters");
    }

    if (!nameRegex.test(name)) {
      return toast.error("Name can only contain letters and spaces");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must include uppercase, lowercase, number, and special character"
      );
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      toast.success(response.data.message || "Signup successfull");

      // clear form
      setTeacher({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return;
    }

    // console.log("Signup Data:", teacher);
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Signup</h2>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={teacher.name}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={teacher.email}
          onChange={handleChange}
        />

        <div className="password-input-container">
          <input
            className="password-input"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={teacher.password}
            onChange={handleChange}
          />

          {showPasswordBtn && (
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>

        <div className="password-input-container">
          <input
            className="password-input"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={teacher.confirmPassword}
            onChange={handleChange}
          />
          {showConfirmPasswordBtn && (
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          )}
        </div>

        <button type="submit">Signup</button>

        <div className="link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;
