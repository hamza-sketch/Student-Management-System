// studentController.js
//
// ⚠️  ADD THESE TWO FIELDS TO YOUR Student MODEL before using this controller:
//
//   status:      { type: String, enum: ["Active","Inactive","Suspended"], default: "Inactive" },
//   tempPassword:{ type: String, default: "" },   // stored plain-text (temp use only)

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const crypto   = require("crypto");

const User    = require("../models/User");
const Student = require("../models/Student");

const generateTempPassword = () => crypto.randomBytes(4).toString("hex"); // e.g. "a3f9c1b2"

const generateRegistrationNumber = async () => {
  const year        = new Date().getFullYear();
  const lastStudent = await Student.findOne().sort({ createdAt: -1 });

  let nextNumber = 1;
  if (lastStudent?.registrationNumber) {
    const parts = lastStudent.registrationNumber.split("-");
    nextNumber  = parseInt(parts[2], 10) + 1;
  }

  return `REG-${year}-${String(nextNumber).padStart(5, "0")}`;
};

// ─── Helper: flatten a Student+User lean object ───────────────────────────────
const flatten = (s) => ({
  studentId:          s._id,
  id:                 s._id,          // frontend convenience alias
  userId:             s.userId?._id,
  name:               s.userId?.name,
  email:              s.userId?.email,
  role:               s.userId?.role,
  registrationNumber: s.registrationNumber,
  dateOfBirth:        s.dateOfBirth,
  gender:             s.gender,
  phone:              s.phone,
  address:            s.address,
  status:             s.status       ?? "Inactive",
  tempPassword:       s.tempPassword ?? "", // included so View modal can show it
  createdAt:          s.createdAt,
  updatedAt:          s.updatedAt,
});

// ─── CREATE STUDENT ───────────────────────────────────────────────────────────
exports.createStudent = async (req, res) => {
  try {
    const { name, email, dateOfBirth, gender, phone, address } = req.body;

    if (!name || !email || !dateOfBirth || !gender || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const registrationNumber = await generateRegistrationNumber();

    const studentExists = await Student.findOne({ registrationNumber });
    if (studentExists) {
      return res.status(400).json({ message: "Registration number already exists" });
    }

    // ✅ Auto-generate password — no longer sent from the frontend
    const tempPassword   = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({ name, email, password: hashedPassword, role: "student" });

    // ✅ status starts as "Inactive" — becomes "Active" on first enrollment
    // ✅ tempPassword stored in plain text so admin can retrieve it from the profile
    const student = await Student.create({
      userId: user._id,
      registrationNumber,
      dateOfBirth,
      gender,
      phone,
      address,
      status:       "Inactive",
      tempPassword,
    });

    res.status(201).json({ message: "Student created", tempPassword, student });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET ALL STUDENTS (pagination · sorting · search · filter) ────────────────
exports.getStudents = async (req, res) => {
  try {
    const {
      page    = 1,
      limit   = 10,
      sortBy  = "createdAt",
      sortDir = "desc",
      search,
      status,
      year,
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page,  10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip     = (pageNum - 1) * limitNum;

    // ── Student-level DB filter ──
    const studentFilter = {};
    if (status && status !== "All") studentFilter.status = status;

    // ── Fetch + populate ──
    let students = await Student.find(studentFilter)
      .populate("userId", "name email role")
      .sort({ createdAt: sortDir === "asc" ? 1 : -1 })
      .lean();

    // ── Flatten ──
    let flattened = students.map(flatten);

    // ── Year filter (on createdAt) ──
    if (year && year !== "All Years") {
      flattened = flattened.filter(
        (s) => new Date(s.createdAt).getFullYear() === parseInt(year, 10)
      );
    }

    // ── Search ──
    if (search) {
      const q = search.toLowerCase();
      flattened = flattened.filter(
        (s) =>
          s.name?.toLowerCase().includes(q)               ||
          s.email?.toLowerCase().includes(q)              ||
          s.registrationNumber?.toLowerCase().includes(q) ||
          s.phone?.toLowerCase().includes(q)
      );
    }

    // ── Sort by flattened field ──
    const sortable = ["name","email","registrationNumber","dateOfBirth","status","createdAt"];
    if (sortable.includes(sortBy)) {
      flattened.sort((a, b) => {
        const cmp = String(a[sortBy] ?? "").localeCompare(String(b[sortBy] ?? ""));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    // ✅ Stats always reflect the full collection (independent of current filter)
    const allStudents = await Student.find().lean();
    const active    = allStudents.filter((s) => s.status === "Active").length;
    const inactive  = allStudents.filter((s) => s.status === "Inactive").length;
    const suspended = allStudents.filter((s) => s.status === "Suspended").length;

    // ── Paginate after in-memory filter/sort ──
    const paginated = flattened.slice(skip, skip + limitNum);
    console.log("get all students ",
      {
      stats: { total: allStudents.length, active, inactive, suspended },
      data:  paginated,
    }
    );
    res.json({
      stats: { total: allStudents.length, active, inactive, suspended },
      data:  paginated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET SINGLE STUDENT ───────────────────────────────────────────────────────
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate("userId", "name email role");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── UPDATE STUDENT ───────────────────────────────────────────────────────────
exports.updateStudent = async (req, res) => {
  try {
    const { name, email, registrationNumber, dateOfBirth, gender, phone, address, status } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const user = await User.findById(student.userId);
    if (!user)    return res.status(404).json({ message: "User not found" });

    // Email uniqueness check
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return res.status(400).json({ message: "Email already exists" });
      user.email = email;
    }

    // Registration number uniqueness check
    if (registrationNumber && registrationNumber !== student.registrationNumber) {
      const regExists = await Student.findOne({ registrationNumber });
      if (regExists) return res.status(400).json({ message: "Registration number already exists" });
      student.registrationNumber = registrationNumber;
    }

    if (name)        user.name           = name;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (gender)      student.gender      = gender;
    if (phone)       student.phone       = phone;
    if (address)     student.address     = address;

    // ✅ Status rules:
    //   "Suspended" → admin manually suspending the student
    //   "Active"    → admin restoring a suspended student (re-activates them)
    //   "Inactive"  → NOT settable from edit form; managed by enrollment events
    // ✅ NEW — restoring checks enrollment count first
    if (status === "Suspended") {
      student.status = "Suspended";
    } else if (status === "Active") {
      // "Active" from the form means admin wants to RESTORE (un-suspend).
      // Restored status depends on whether the student has any enrollments.
      const Enrollment = require("../models/Enrollment");
      const enrollmentCount = await Enrollment.countDocuments({ studentId: student._id });
      student.status = enrollmentCount > 0 ? "Active" : "Inactive";
    }

    await user.save();
    await student.save();

    const updated = await Student.findById(student._id).populate("userId", "name email role");
    res.json({ message: "Student updated successfully", student: updated });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE STUDENT ───────────────────────────────────────────────────────────
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── BULK DELETE ─────────────────────────────────────────────────────────────
exports.bulkDeleteStudents = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No student IDs provided" });
    }

    const invalid = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalid.length) {
      return res.status(400).json({ message: `Invalid IDs: ${invalid.join(", ")}` });
    }

    const students = await Student.find({ _id: { $in: ids } });
    if (!students.length) return res.status(404).json({ message: "No matching students found" });

    const userIds = students.map((s) => s.userId);
    await User.deleteMany({ _id: { $in: userIds } });
    await Student.deleteMany({ _id: { $in: ids } });

    res.json({ message: `${students.length} student(s) deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── ENROLLMENT STATUS HOOKS ──────────────────────────────────────────────────
// Call these from your Enrollment controller to auto-manage Active/Inactive.

// Call at the END of createEnrollment — activates student on first enrollment
exports.activateStudentIfNeeded = async (studentId) => {
  const student = await Student.findById(studentId);
  if (student && student.status === "Inactive") {
    student.status = "Active";
    await student.save();
  }
};

// Call at the END of deleteEnrollment — deactivates student if no enrollments remain
exports.deactivateStudentIfNoEnrollments = async (studentId) => {
  const Enrollment = require("../models/Enrollment");
  const count = await Enrollment.countDocuments({ studentId });
  if (count === 0) {
    await Student.findByIdAndUpdate(studentId, { status: "Inactive" });
  }
};