// controllers/enrollmentController.js

const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");


// 📌 Enroll Student
exports.enrollStudent = async (req, res) => { 
  try {
    const { studentId, courseId } = req.body;

    // Check student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    res.status(201).json({
      message: "Student enrolled successfully",
      enrollment,
    });

  } catch (error) {
    // Handle duplicate enrollment
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Student already enrolled in this course",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate({
        path: "studentId",
        select: "registrationNumber",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .populate("courseId", "courseName");

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const { status } = req.body;
  
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({
      message: "Enrollment updated successfully",
      enrollment,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Remove Enrollment
exports.removeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    res.json({ message: "Enrollment removed successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentsByCourse = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      courseId: req.params.id,
    }).populate({
      path: "studentId",
      populate: {
        path: "userId",
        select: "name email"
      }
    });

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 Get Courses of a Student
exports.getCoursesByStudent = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.params.id,
    }).populate("courseId");

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};