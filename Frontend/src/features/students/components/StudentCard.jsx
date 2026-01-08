import { useState, useRef } from "react";
import api from "../../../services/api";
import "./StudentCard.css";
import { toast } from "react-toastify";

const StudentCard = ({ student, isEditable = false, onUploadSuccess }) => {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Construct URL with a fallback to the backend's default-avatar image
  const imageUrl = student.profileImage
    ? `http://localhost:7000/${student.profileImage.replace(/\\/g, "/")}`
    : `http://localhost:7000/uploads/default-avatar.png`;

  // Updated fallback: if student has no image, use a UI placeholder or your local default
  const defaultImage =
    "https://ui-avatars.com/api/?name=" + student.name + "&background=random";

  const handleImageClick = () => {
    if (isEditable) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Show local preview immediately
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("studentId", student._id); // <--- Send the ID explicitly

    try {
      const response = await api.post("/students/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Axios usually handles this, but good to be explicit
      });

      toast.success("Profile updated!");

      // Reset local states
      setSelectedFile(null);
      setPreview(null);

      // Trigger the parent to re-fetch data instead of reloading the page
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const initials = student.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="student-card">
      <div className="card-header">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="image/*"
        />

        <div
          className={`avatar-large ${isEditable ? "editable" : ""}`}
          onClick={handleImageClick}
        >
          <img src={preview || imageUrl} alt="profile" className="avatar-img" />
          {isEditable && <div className="overlay">Change Photo</div>}
        </div>

        <div className="student-info-centered">
          <h4>{student.name}</h4>
          <p className="student-email">{student.email}</p>

          {/* Centered Department Section */}
          <div className="department-badge-container">
            <span className="dept-label">Department:</span>
            <span className="dept-value">{student.departmentId}</span>
          </div>
        </div>
      </div>

      <div className="card-body">
        <p className="section-title">Enrolled Subjects</p>
        <div className="subject-tags">
          {student.subjectIds?.map((sub, index) => (
            <span key={index} className="tag">
              {sub}
            </span>
          ))}
        </div>
      </div>

      {selectedFile && isEditable && (
        <div className="upload-actions">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              setPreview(null);
              setSelectedFile(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      <div className="card-footer">
        <button className="view-btn">View Full Profile</button>
      </div>
    </div>
  );
};

export default StudentCard;
