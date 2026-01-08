import React, { useEffect, useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import api from "../../../services/api";
import "./StudentDashboard.css";
import StudentCard from "../components/StudentCard";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/students/profile");
      setStudentData(response.data);
    } catch (err) {
      console.error("Error fetching student data");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="student-dashboard-container">
        <header className="dashboard-hero">
          <h1>Student Learning Area</h1>
          <p>View your assigned courses and department details below.</p>
        </header>

        {studentData && (
          <StudentCard
            student={studentData}
            isEditable={true}
            onUploadSuccess={fetchProfile} // <--- Pass this function
          />
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
