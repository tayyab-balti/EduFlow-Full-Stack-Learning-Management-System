const bcrypt = require("bcrypt")
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Teacher.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Teacher.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();

    res.status(200).json({
      success: true,
      message: "Admin dashboard data",
      stats: {
        totalStudents,
        totalTeachers
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password");
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching teachers" });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select("-password").populate("invitedBy", "name");
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};
