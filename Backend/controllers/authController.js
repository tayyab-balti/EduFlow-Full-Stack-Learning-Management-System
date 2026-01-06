const Teacher = require("../models/Teacher");
const Student = require("../models/Student")
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Teacher.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await Teacher.findOne({ email });

    if (!user){
      user = await Student.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(`User found: ${user.email}, Role: ${user.role}`);
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "student"
      },
    });
  } catch (error) {
    next(error);
  }
};
