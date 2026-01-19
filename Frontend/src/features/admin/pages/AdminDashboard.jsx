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

  // NEW: Selection & Scheduling States
  const [selectedIds, setSelectedIds] = useState([]);
  const [delayValue, setDelayValue] = useState(1);
  const [delayUnit, setDelayUnit] = useState("minutes");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, studentsRes] = await Promise.all([
        api.get("/admin/teacher-dashboard"),
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

  // Fetch only once when the component mounts
  useEffect(() => {
    fetchAdminData();
  }, []);

  // Clear selection when navigating or searching
  useEffect(() => {
    setSelectedIds([]);
  }, [currentPage, searchTerm]);

  // Selection Logic
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (currentDisplayItems) => {
    // Check if every student on the CURRENT page is already selected
    const allOnPageSelected = currentDisplayItems.every((s) =>
      selectedIds.includes(s._id)
    );

    if (allOnPageSelected) {
      // Unselect only the students on this page
      const pageIds = currentDisplayItems.map((s) => s._id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      // Add only the students from this page that aren't already selected
      const pageIds = currentDisplayItems.map((s) => s._id);
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    }
  };

  // Scheduling API Call
  const handleScheduleDelete = async () => {
    setIsScheduling(true);
    try {
      await api.post("/admin/students/schedule-delete", {
        studentIds: selectedIds,
        delayValue: parseInt(delayValue),
        delayUnit,
      });

      toast.success("Deletion scheduled successfully!");
      setSelectedIds([]); // Clear selection
      setIsModalOpen(false); // Close custom modal
      fetchAdminData(); // Refresh the table
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to schedule deletion"
      );
    } finally {
      setIsScheduling(false);
    }
  };

  // Filter Logic
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.invitedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const showAll = searchTerm.length >= 5;

  const displayStudents = showAll
    ? filteredStudents
    : filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <div className="loader">Loading Admin Portal...</div>;

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <h1>Admin Dashboard</h1>

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

        {/* Scheduling Action Bar */}
        {selectedIds.length > 0 && (
          <div className="schedule-action-bar">
            <div className="action-info">
              <strong>{selectedIds.length}</strong> students selected for
              deletion
            </div>
            <div className="action-controls">
              <span>Delete in:</span>
              <input
                type="number"
                min="1"
                value={delayValue}
                onChange={(e) => setDelayValue(e.target.value)}
              />
              <select
                value={delayUnit}
                onChange={(e) => setDelayUnit(e.target.value)}
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
              <button
                className="schedule-btn"
                onClick={() => setIsModalOpen(true)}
                disabled={isScheduling}
              >
                {isScheduling ? "Processing..." : "Confirm Schedule"}
              </button>
              <button className="cancel-btn" onClick={() => setSelectedIds([])}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="table-container">
          <div className="table-header-actions">
            <h2>Registered Students</h2>
            <input
              type="text"
              placeholder="Search by name, email or teacher..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      displayStudents.length > 0 &&
                      displayStudents.every((s) => selectedIds.includes(s._id))
                    }
                    onChange={() => toggleSelectAll(displayStudents)}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Assigned Teacher</th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.map((student) => (
                <tr
                  key={student._id}
                  className={
                    selectedIds.includes(student._id) ? "row-selected" : ""
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student._id)}
                      onChange={() => toggleSelect(student._id)}
                    />
                  </td>
                  <td>
                    {student.name}
                    {student.isPendingDelete && (
                      <span className="pending-tag">
                        Scheduled for Deletion
                      </span>
                    )}
                  </td>
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
              {isModalOpen && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Confirm Scheduled Deletion</h3>
                    <p>
                      You are about to schedule the deletion of{" "}
                      <strong>{selectedIds.length}</strong> student(s). This
                      action will take place in{" "}
                      <strong>
                        {delayValue} {delayUnit}
                      </strong>
                      .
                    </p>
                    <div className="modal-actions">
                      <button
                        className="confirm-btn"
                        onClick={() => {
                          handleScheduleDelete(); // Call your existing function
                          setIsModalOpen(false);
                        }}
                      >
                        Proceed
                      </button>
                      <button
                        className="cancel-btn-alt"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
