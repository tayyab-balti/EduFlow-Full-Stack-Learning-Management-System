const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher");

const generateToken = (user) => {
  return jwt.sign({  // payload
    id: user._id, 
    name: user.name, 
    role: user.role }, 
    
    process.env.JWT_SECRET, {
      expiresIn: "1d",
    });  
};

module.exports = generateToken;
