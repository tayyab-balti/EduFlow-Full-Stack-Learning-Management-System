const bcrypt = require("bcrypt")
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, secretKey} = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the secret key matches the one in your environment variables
  if (secretKey !== process.env.ADMIN_CREATION_KEY) {
    return res.status(403).json({ message: "Unauthorized: Invalid Secret Key" });
  }

    // Email Format Validation (Regex) - ensures Postman users can't send malformed emails like "@gmail.com"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // SINGLE ADMIN RULE - Search the database for ANY user that has the role "admin"
    const existingAdminCount = await Teacher.countDocuments({ role: "admin" });
    
    if (existingAdminCount > 0) {
      return res.status(403).json({ message: "You are unable to become admin. An admin already exists." });
    }

    // Check if email is already taken (even if not an admin)
    const emailExists = await Teacher.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
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

    // Filter the count to exclude anyone with the "admin" role
    const totalTeachers = await Teacher.countDocuments({"role": "teacher"});

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

exports.scheduleStudentDeletion = async (req, res) => {
  try {
    const { studentIds, delayValue, delayUnit } = req.body; // e.g., 5, 'minutes'

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: "No students selected" });
    }

    // Calculate delay in milliseconds
    let delayMs = delayValue * 1000; // default seconds
    if (delayUnit === "minutes") delayMs *= 60;
    if (delayUnit === "hours") delayMs *= 3600;

    const deleteTime = new Date(Date.now() + delayMs);

    // Mark students for deletion
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { 
        $set: { 
          isPendingDelete: true,
          scheduledDeleteAt: deleteTime 
        } 
      }
    );

    res.status(200).json({ 
      message: `Successfully scheduled ${studentIds.length} students for deletion at ${deleteTime.toLocaleString()}` 
    });
  } catch (error) {
    res.status(500).json({ message: "Scheduling failed", error: error.message });
  }
};