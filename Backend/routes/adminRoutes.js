const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  adminSignup,
  getAdminDashboard,
  getAllTeachers,
  getAllStudents
} = require("../controllers/adminController");

// PUBLIC ROUTE (NO middleware)
router.post("/signup", adminSignup)

// PROTECTED ADMIN ROUTES
router.use(authMiddleware);
router.use(adminOnly);

// Admin APIs
router.get("/dashboard", getAdminDashboard);
router.get("/teachers", getAllTeachers);
router.get("/students", getAllStudents);

module.exports = router;
