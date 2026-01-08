const express = require("express");
const { inviteStudent, getMyStudents, updateStudentProfile, getMyProfile  } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig")

const router = express.Router();

router.post("/invite", authMiddleware, inviteStudent);
router.get("/my-students", authMiddleware, getMyStudents);
router.get("/profile", authMiddleware, getMyProfile);
router.post('/update-profile', authMiddleware, upload.single('avatar'), updateStudentProfile )

module.exports = router;