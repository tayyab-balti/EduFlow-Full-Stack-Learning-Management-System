const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, // Optimizes search by name
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate emails
      index: true,  // Optimizes search by email
    },
    password: {
      type: String,
      required: true
    },
    departmentId: {
      type: String,
      required: true,
    },
    subjectIds: [
      {
        type: String,
        required: true,
      },
    ],
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true, // Optimizes filtering students by teacher
    },
    status: {
      type: String,
      enum: ["invited", "registered", "active"],
      default: "invited",
    },
    role: {
      type: String,
      default: "student"
    }, 
  },
  { timestamps: true }
);

// This creates a compound index for even faster searching when filtering by teacher + name/email
studentSchema.index({ invitedBy: 1, name: 1 });
studentSchema.index({ invitedBy: 1, email: 1 });

module.exports = mongoose.model("Student", studentSchema);