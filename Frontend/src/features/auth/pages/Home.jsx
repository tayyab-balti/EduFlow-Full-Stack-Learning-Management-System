import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar Overlay */}
      <nav className="home-nav">
        <div className="logo">
          LMS<span>Portal</span>
        </div>
        <div className="nav-buttons">
          <button className="btn-secondary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <span className="badge">New: Student Tracking 2.0</span>
          <h1>
            Empower Your Learning with <br /> <span>Next-Gen Management</span>
          </h1>
          <p>
            The all-in-one platform for Admins, Teachers, and Students.
            Streamline your department, manage subjects, and track progress
            effortlessly in one beautiful interface.
          </p>

          <div className="hero-actions">
            <button className="cta-main" onClick={() => navigate("/signup")}>
              Join as a Student
            </button>
            <button className="cta-sub" onClick={() => navigate("/login")}>
              Teacher Dashboard
            </button>
          </div>
        </div>

        <div className="hero-image">
          {/* You can replace this with a real illustration/image later */}
          <div className="glass-card">
            <div className="circle-bg"></div>
            <div className="stats-preview">
              <div className="line"></div>
              <div className="line short"></div>
            </div>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>&copy; 2026 LMS Portal. Built for excellence.</p>
      </footer>
    </div>
  );
};

export default Home;
