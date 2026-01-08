const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const errorHandler = require("./middleware/errorMiddleware")
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));   // If you upload files + form data

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use('/uploads', express.static('uploads'));
app.use(errorHandler)
app.use("/api/admin/", adminRoutes)

app.listen(7000, () => {
  console.log("Server running on port 7000");
});