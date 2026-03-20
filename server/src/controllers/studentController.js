const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const User = require("../models/User");
const Student = require("../models/Student");

const generateTempPassword = () => crypto.randomBytes(4).toString("hex");

// HELPER FUNCTION TO GENERATE HE REGISTERATION-NUMBER
const generateRegistrationNumber = async () => {    
  const year = new Date().getFullYear();
  const count = await Student.countDocuments();
  const number = String(count + 1).padStart(5, "0");
  return `REG-${year}-${number}`;         // FORMAT
};

exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      dateOfBirth,
      gender,
      phone,
      address
    } = req.body;
    
    if (
      !name || !email  ||
      !dateOfBirth || !gender || !phone || !address
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const registrationNumber  = await generateRegistrationNumber();
    console.log("user created");
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const studentExists = await Student.findOne({ registrationNumber }); // save-end
    if (studentExists) {
      return res.status(400).json({ message: "Registration number already exists" });
    }

    // temp password
     const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student"
    });
    const student = await Student.create({
      userId: user._id,
      registrationNumber,
      dateOfBirth,
      gender,
      phone,
      address
    });

    res.status(201).json({
      message: "Student created",
      tempPassword,
      student
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL STUDENTS
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE STUDENT
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "userId",
      "name email role"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      registrationNumber,
      dateOfBirth,
      gender,
      phone,
      address
    } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const user = await User.findById(student.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.email);
    // 🔍 Email uniqueness check
    if (email && ( email != user.email ) ) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exist" });
      }
      user.email = email;
    }

    // 🔍 Registration number uniqueness
    if (
      registrationNumber &&
      registrationNumber !== student.registrationNumber
    ) {
      const regExists = await Student.findOne({ registrationNumber });
      if (regExists) {
        return res.status(400).json({
          message: "Registration number already exists"
        });
      }
      student.registrationNumber = registrationNumber;
    }

    // ✅ Update fields
    if (name) user.name = name;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (gender) student.gender = gender;
    if (phone) student.phone = phone;
    if (address) student.address = address;

    await user.save();
    await student.save();

    const updatedStudent = await Student.findById(student._id)
      .populate("userId", "name email role");

    res.json({
      message: "Student updated successfully",
      student: updatedStudent
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // delete linked user first
    await User.findByIdAndDelete(student.userId);

    // delete student profile
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};