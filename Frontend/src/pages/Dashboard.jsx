import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddStudentForm from "../components/StudentForm/AddStudentForm";
import StudentList from "../components/StudentList/StudentList";
import "./Dashboard.css";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
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
            <span className="btn-icon">{showForm ? "✕ " : "＋ "}</span>
            {showForm ? "Cancel" : "Add New Student"}
          </button>

          {showForm && (
            <AddStudentForm onStudentAdded={() => setShowForm(false)} />
          )}

          {!showForm && <StudentList />}
        </main>
      </div>
    </>
  );
}

export default Dashboard;
