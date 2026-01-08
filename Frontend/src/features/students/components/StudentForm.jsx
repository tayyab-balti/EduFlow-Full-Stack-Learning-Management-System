import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../services/api";
import "./StudentForm.css";

function AddStudentForm({ onStudentAdded }) {
  const [studentCredentials, setStudentCredentials] = useState({
    name: "",
    email: "",
    departmentId: "",
    subjectIds: [],
  });

  const subjects = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Robotics",
    "Machine Learning",
  ];

  const handleChange = (e) => {
    setStudentCredentials({
      ...studentCredentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, departmentId, subjectIds } = studentCredentials;

    if (!name || !email || !departmentId || !subjectIds) {
      return toast.error(
        "Please fill all fields and select at least one subject"
      );
    }

    try {
      const response = await api.post("/students/invite", studentCredentials);

      toast.success(response?.data?.message || "Student invited successfully");

      // send student back to parent (Dashboard) and close form
      if (onStudentAdded) {
        onStudentAdded({
          ...studentCredentials,
          _id: response?.data?.student?._id || Date.now(), // fallback _id
        });
      }

      // reset local form state
      setStudentCredentials({
        name: "",
        email: "",
        departmentId: "",
        subjectIds: [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <form className="student-form" onSubmit={handleSubmit}>
        <h3>Add Student</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={studentCredentials.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={studentCredentials.email}
          onChange={handleChange}
        />
        <select
          name="departmentId"
          value={studentCredentials.departmentId}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select Department
          </option>
          <option value="Computer Science">Computer Science</option>
          <option value="Artificial Intelligence">
            Artificial Intelligence
          </option>
          <option value="Cyber security">Cyber security</option>
          <option value="Data Science">Data Science</option>
        </select>
        <div className="subjects-selection">
          <p>Select Subjects:</p>
          {subjects.map((sub) => (
            <label key={sub}>
              <input
                type="checkbox"
                checked={studentCredentials.subjectIds.includes(sub)}
                onChange={(e) => {
                  const selected = e.target.checked
                    ? [...studentCredentials.subjectIds, sub]
                    : studentCredentials.subjectIds.filter((s) => s !== sub);
                  setStudentCredentials({
                    ...studentCredentials,
                    subjectIds: selected,
                  });
                }}
              />
              {sub}
            </label>
          ))}
        </div>
        <button type="submit">Invite Student</button>
      </form>
    </>
  );
}

export default AddStudentForm;
