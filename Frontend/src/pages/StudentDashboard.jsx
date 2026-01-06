import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/students/profile");
        setStudentData(response.data);
      } catch (err) {
        console.error("Error fetching student data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loader">Loading your profile...</div>;

  return (
    <>
      <Navbar />
      <div className="student-dashboard-container">
        <header className="dashboard-hero">
          <h1>Student Learning Area</h1>
          <p>View your assigned courses and department details below.</p>
        </header>

        <div className="info-grid">
          <div className="info-card">
            <h3>Department</h3>
            <p className="highlight-text">
              {studentData?.departmentId || "General"}
            </p>
          </div>

          <div className="info-card">
            <h3>My Subjects</h3>
            <div className="subject-list">
              {studentData?.subjectIds?.map((sub, index) => (
                <div key={index} className="subject-tag">
                  {sub}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
