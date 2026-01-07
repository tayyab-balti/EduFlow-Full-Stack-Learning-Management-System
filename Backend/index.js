const express = require("express");
const cors = require("cors");
const multer = require("multer"); 
require("dotenv").config();

const connectDB = require("./config/db");
const Student = require("./models/Student"); 
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const upload = require('./middleware/multerConfig');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const updateImage = async () => {
    await Student.updateMany(
        {profileImage: {$exists: false}},
        {$set: {profileImage: "uploads/default-avatar.png"}}
    )
    console.log("Existing students updated with default avatar!");
}
updateImage()

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use('/uploads', express.static('uploads'));

app.post('/api/students/update-profile', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });

        // IMPORTANT: If you don't have auth middleware yet, req.user is undefined.
        // For now, let's assume you're sending the studentId in the formData or via auth.
        // If using auth middleware, it should be app.post('...', protect, upload.single...)
        const studentId = req.user?.id || req.body.studentId; 

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

        // console.log("Updated Student:", updatedStudent);

        res.json(updatedStudent); // Return the full updated object

    } catch (err) {
        console.error("Database Error:", err); // This helps you see the REAL error in your terminal
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File is too large. Max limit is 2MB" });
        }
    }
    res.status(500).json({ message: error.message });
});

app.listen(7000, () => {
  console.log("Server running on port 7000");
});