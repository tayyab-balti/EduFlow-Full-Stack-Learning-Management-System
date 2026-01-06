const express = require("express");
const { inviteStudent, getMyStudents } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("Student routes loaded");

const router = express.Router();

router.post("/invite", authMiddleware, inviteStudent);
router.get("/my-students", authMiddleware, getMyStudents);

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const Student = require("../models/Student");
    const student = await Student.findById(req.user.id);
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;