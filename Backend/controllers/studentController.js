const Student = require("../models/Student");
const Teacher = require("../models/Teacher")
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt")
const { generateSecureString } = require("../utils/cryptoUtils")

exports.inviteStudent = async (req, res, next) => {
  try {
    const { name, email, departmentId, subjectIds } = req.body;
    const teacherId = req.user.id;
    const teacherName = req.user.name;

    if (!name || !email || !departmentId || !Array.isArray(subjectIds) || subjectIds.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // CHECK: Is this email already registered as a TEACHER?
    const isTeacher = await Teacher.findOne({ email });
    if (isTeacher) {
      return res.status(400).json({ 
        message: "This email belongs to a Teacher account and cannot be invited as a student." 
      });
    }

    // Check: Is this student already invited by this teacher?
    const existingStudent = await Student.findOne({ email, teacherId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already invited" });
    }

    const plainPassword = generateSecureString(16)

    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      departmentId,
      subjectIds,
      invitedBy: teacherId,
      role: "student",
    });


    await sendEmail({
      to: email,
      subject: "You are invited to LMS",
      password: plainPassword,
      html: `
        <h2>Hello ${name || "Student"},</h2>
        <p>You have been invited to join our Learning Management System.</p>

        <div>
          <p><strong>Invited by:</strong> ${teacherName}</p>
          <p><strong>Department:</strong> ${departmentId}</p>
          <p><strong>Subjects:</strong> ${subjectIds.join(", ")}</p>
          <p>Your temporary password is: <strong>${plainPassword}</strong></p>
          <p>Please change this password immediately after logging in.</p>
          <p>Login here: <a href="http://localhost:5173/login">LMS Portal</a></p>
        </div>

        <p>Thank you!</p>
      `,
    });

    const studentData = student.toObject()
    delete studentData.password

    res.status(201).json({
      message: "Student invited successfully",
      student: studentData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyStudents = async (req, res) => {
  try {
    // 1. Get parameters from URL (e.g., /api/students?page=1&limit=5&search=john)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    // 2. Build the Query Object
    const query = {
      invitedBy: req.user.id, // Only get students invited by THIS teacher
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } }
      ]
    };

    // 3. Execute queries
    // We count documents using the same 'query' so pagination numbers are accurate during search
    const totalStudents = await Student.countDocuments(query);

    // Fetch only the specific "chunk" of students
    const students = await Student.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      students,
      pagination: {
        totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const Student = require("../models/Student");
    const student = await Student.findById(req.user.id);
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


exports.updateStudentProfile  = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // IMPORTANT: If you don't have auth middleware yet, req.user is undefined.
        // For now, let's assume you're sending the studentId in the formData or via auth.
        // If using auth middleware, it should be app.post('...', protect, upload.single...)
        const studentId = req.user.id; 

        if (!studentId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const filePath = req.file.path.replace(/\\/g, "/");

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId, 
            { $set: { profileImage: filePath } }, // Use $set to be explicit
            { new: true, runValidators: true } 
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Ensure student can update only their own profile:
        if (updatedStudent._id.toString() !== req.user.id) {
          return res.status(403).json({ message: "Unauthorized" });
        }


        // console.log("Updated Student:", updatedStudent);

        res.json(updatedStudent); // Return the full updated object

    } catch (err) {
        console.error("Database Error:", err); // This helps you see the REAL error in your terminal
        res.status(500).json({ message: "Server error", error: err.message });
    }
}