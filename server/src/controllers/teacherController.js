const Teacher = require("../models/Teacher");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generateTempPassword = () => crypto.randomBytes(4).toString("hex");

const generateTeacherId = async () => {
  const year = new Date().getFullYear();

  const count = await Teacher.countDocuments();

  const number = String(count + 1).padStart(3, "0");

  return `TCH-${year}-${number}`;
};


// CREATE TEACHER
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, designation, phone } = req.body;

    if (!name || !email || !designation || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔥 generate teacherId
    const teacherId = await generateTeacherId();

    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher"
    });

    const teacher = await Teacher.create({
      userId: user._id,
      teacherId,
      designation,
      phone
    });

    res.status(201).json({
      message: "Teacher created successfully",
      tempPassword,
      teacher
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//   GET ALL TEACHERS
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE TEACHER BY ID 
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate("userId", "name email role");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateTeacher = async (req, res) => {
  try {
    const { name, email, designation, phone } = req.body;

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const user = await User.findById(teacher.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // email uniqueness
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (designation) teacher.designation = designation;
    if (phone) teacher.phone = phone;

    await user.save();
    await teacher.save();

    const updated = await Teacher.findById(teacher._id)
      .populate("userId", "name email role");

    res.json({
      message: "Teacher updated successfully",
      teacher: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TEACHER
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(req.params.id);

    res.json({ message: "Teacher deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};