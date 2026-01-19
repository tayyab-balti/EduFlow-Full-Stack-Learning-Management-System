import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentForm from "../../students/components/StudentForm";
import StudentList from "../../students/components/StudentList";
import "./TeacherDashboard.css";
import Navbar from "../../../components/layout/Navbar";

function TeacherDashboard() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    // localStorage.clear()
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-page">
        {/* ... header ... */}
        <main className="dashboard-content">
          <button
            className={`toggle-form-btn ${showForm ? "close-btn" : "add-btn"}`}
            onClick={() => setShowForm(!showForm)}
          >
            <span className="btn-icon">
              {showForm ? "✕ Cancel" : "＋ Add New Student"}
            </span>
            {/* {showForm ? "Cancel" : "Add New Student"} */}
          </button>

          {showForm && (
            <StudentForm onStudentAdded={() => setShowForm(false)} />
          )}

          {!showForm && <StudentList />}
        </main>
      </div>
    </>
  );
}

export default TeacherDashboard;
