import { useState, useEffect } from "react";
import StudentCard from "../StudentCard/StudentCard";
import "./StudentList.css";
import api from "../../services/api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This handles the debounce
    const delayDebounceFn = setTimeout(() => {
      loadStudents();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, currentPage]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/students/my-students`, {
        params: {
          search: query,
          page: currentPage, // This will be 1 if handleSearchChange was called
          limit: 5,
        },
      });

      if (response.data.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.totalPages || 1);

        // Safety check: If backend says we are on page 1 but our state is different
        if (response.data.pagination.currentPage !== currentPage) {
          setCurrentPage(response.data.pagination.currentPage);
        }
      }
    } catch (err) {
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setCurrentPage(1); // Force reset to first page for any new search string
  };

  return (
    <>
      <div className="student-list-container">
        <div className="list-header">
          <h3>Invited Students</h3>
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email..."
              value={query}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="student-flex">
          {loading ? (
            <div className="status-message">
              <div className="spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              {query ? (
                <p>
                  No students found matching "<strong>{query}</strong>"
                </p>
              ) : (
                <div className="welcome-state">
                  <div className="empty-icon">🎓</div>
                  <h4>Start your journey</h4>
                  <p>
                    You haven't invited any students yet. Click "Add New
                    Student" to get started.
                  </p>
                </div>
              )}
            </div>
          ) : (
            students.map((student) => (
              <StudentCard
                key={student._id}
                student={student}
                isEditable={false}
              />
            ))
          )}
        </div>

        {/* Pagination Controls (Only show if there is more than 1 page) */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
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
    </>
  );
};

export default StudentList;
