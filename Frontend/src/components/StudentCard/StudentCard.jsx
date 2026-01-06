import "./StudentCard.css";

const StudentCard = ({ student }) => {
  const initials = student.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="student-card">
      <div className="card-top">
        <div className="avatar">{initials}</div>
        <div className="student-info">
          <h4>{student.name}</h4>
          <p>{student.email}</p>
          <div className="department">
            <strong>Department:</strong> {student.departmentId}
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="subject-tags">
          {student.subjectIds?.map((sub, index) => (
            <span key={index} className="tag">
              {sub}
            </span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <button className="view-btn">View Profile</button>
      </div>
    </div>
  );
};

export default StudentCard;
