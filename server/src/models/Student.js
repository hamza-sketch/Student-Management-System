const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
     status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Inactive",
    },
     tempPassword:{ type: String, default: "" },   // stored plain-text (temp use only)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);