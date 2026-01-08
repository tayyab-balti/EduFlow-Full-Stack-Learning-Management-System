import { useEffect, useState } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";
import "./AdminDashboard.css";
import Navbar from "../../../components/layout/Navbar";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0 });
  const [loading, setLoading] = useState(true);

  // Search and Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          api.get("/admin/dashboard"),
          api.get("/admin/students"),
        ]);
        setStats(statsRes.data.stats);
        setStudents(studentsRes.data.students);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  // 1. Filter Logic (Search by Name, Email, or Teacher)
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.invitedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const showAll = searchTerm.length >= 5;

  // Logic for displaying items
  const displayStudents = showAll
    ? filteredStudents
    : filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="loader">Loading Admin Portal...</div>;

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

        {/* Stats Cards remain the same */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Teachers</h3>
            <p>{stats.totalTeachers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
        </div>

        <div className="table-container">
          <div className="table-header-actions">
            <h2>Registered Students</h2>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name, email or teacher..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 when searching
              }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Assigned Teacher</th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.departmentId}</td>
                  <td>
                    <span className="teacher-badge">
                      {student.invitedBy?.name || "Admin"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {!showAll && filteredStudents.length > itemsPerPage && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
