// controllers/gradeController.js

const Grade = require("../models/Grade");
const Student = require("../models/Student");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");


// helper for populate
const populateGrade = async (id) => 
{
  return Grade.findById(id)
    .populate({
      path: "studentId",
      select: "registrationNumber userId",
      populate: {
        path: "userId",
        select: "name email",
      },
    })
    .populate("courseId", "courseCode title");
};


// 📌 Assign Grade
exports.assignGrade = async (req, res) => {
  try {
    const { studentId, courseId, marks, grade } = req.body;

    if (!studentId || !courseId || marks === undefined || !grade) {
      return res.status(400).json({
        message: "studentId, courseId, marks and grade are required",
      });
    }

    // check student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // check course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔥 check enrollment
    const enrollment = await Enrollment.findOne({
      studentId,
      courseId,
    });

    if (!enrollment) {
      return res.status(400).json({
        message: "Student is not enrolled in this course",
      });
    }

    // create grade
    const newGrade = await Grade.create({
      studentId,
      courseId,
      marks,
      grade,
    });

    const populated = await populateGrade(newGrade._id);

    res.status(201).json({
      message: "Grade assigned successfully",
      grade: populated,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Grade already assigned for this student in this course",
      });
    }

    res.status(500).json({ message: error.message });
  }
};


// 📌 Update Grade (marks + grade only)
exports.updateGrade = async (req, res) => {
  try {
    const { marks, grade } = req.body;

    const existing = await Grade.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Grade not found" });
    }

    if (marks !== undefined) existing.marks = marks;
    if (grade) existing.grade = grade;

    await existing.save();

    const populated = await populateGrade(existing._id);

    res.json({
      message: "Grade updated successfully",
      grade: populated,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 Delete Grade
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    res.json({ message: "Grade deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 Get Grades of Student
exports.getGradesByStudent = async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.id })
      .populate({
        path: "studentId",
        select: "registrationNumber userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode title");

    res.json(grades);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 Get Grades of Course
exports.getGradesByCourse = async (req, res) => {
  try {
    const grades = await Grade.find({ courseId: req.params.id })
      .populate({
        path: "studentId",
        select: "registrationNumber userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode title");

    res.json(grades);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 📌 Get All Grades (Admin)
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate({
        path: "studentId",
        select: "registrationNumber userId",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .populate("courseId", "courseCode title");

    res.json(grades);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};