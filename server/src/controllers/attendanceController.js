

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const normalizeDate = (inputDate) => {
  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return null;
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const populateAttendance = async (attendanceId) => 
{
  return Attendance.findById(attendanceId)
    .populate({
      path: "studentId",
      select: "registrationNumber userId",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .populate("courseId", "courseCode title")
    .populate("markedBy", "name email");
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status, notes } = req.body;

    if (!studentId || !courseId || !date || !status) {
      return res.status(400).json({
        message: "studentId, courseId, date, and status are required",
      });
    }

    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollment = await Enrollment.findOne({
      studentId,
      courseId,
      status: "active",
    });

    if (!enrollment) {
      return res.status(400).json({
        message: "Student is not actively enrolled in this course",
      });
    }

    const existingAttendance = await Attendance.findOne({
      studentId,
      courseId,
      date: normalizedDate,
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already marked for this student on this date",
      });
    }

    const attendance = await Attendance.create({
      studentId,
      courseId,
      date: normalizedDate,
      status,
      notes,
      markedBy: req.user?._id || null,
    });

    const populatedAttendance = await populateAttendance(attendance._id);

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already exists for this student, course, and date",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    if (status) attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;

    await attendance.save();

    const populatedAttendance = await populateAttendance(attendance._id);

    res.json({
      message: "Attendance updated successfully",
      attendance: populatedAttendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance
exports.getAllAttendance = async (req, res) => {
  try {
    const { studentId, courseId, date, status } = req.query;
    const filter = {};

    if (studentId) filter.studentId = studentId;
    if (courseId) filter.courseId = courseId;
    if (status) filter.status = status;

    if (date) {
      const normalizedDate = normalizeDate(date);
      if (!normalizedDate) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      filter.date = normalizedDate;
    }

    const attendance = await Attendance.find(filter)
      .sort({ date: -1, createdAt: -1 })
      .populate({
        path: "studentId",
        select: "registrationNumber userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode title")
      .populate("markedBy", "name email");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance by course
exports.getAttendanceByCourse = async (req, res) => {
  try {
    const attendance = await Attendance.find({ courseId: req.params.id })
      .sort({ date: -1, createdAt: -1 })
      .populate({
        path: "studentId",
        select: "registrationNumber userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode title")
      .populate("markedBy", "name email");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance by student
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.id })
      .sort({ date: -1, createdAt: -1 })
      .populate({
        path: "studentId",
        select: "registrationNumber userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode title")
      .populate("markedBy", "name email");

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};