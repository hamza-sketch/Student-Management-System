
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');


const generateCourseCode = async () => {
  const year = new Date().getFullYear();
  const count = await Course.countDocuments();
  const number = String(count + 1).padStart(3, "0");
  return `CRS-${year}-${number}`;
};

// CREATE-COURSE
exports.createCourse = async (req, res) => {
  try {
    const { title, credits } = req.body;

    if (!title || !credits) {
      return res.status(400).json({
        message: "Title and credits are required"
      });
    }

    // 1. Generate what the normalized version would look like
const inputNormalized = title.trim().toLowerCase().replace(/\s+/g, '');
    // 2. Search the DB for that specific version
    const courseExists = await Course.findOne({ normalizedTitle: inputNormalized });

    if (courseExists) {
      return res.status(409).json({ 
        message: "A course with this name already exists (ignoring spaces/caps)." 
      });
    }
    
    const courseCode = await generateCourseCode();

    console.log("I am HERE");
   const course = await Course.create({
         courseCode,
         title,
        normalizedTitle: inputNormalized,
         credits
       });

    res.status(201).json({
      message: "Course created successfully",
      course
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ASSIGN-TEACHER TO COURSE
exports.assignTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(409).json({ message: "Course not found" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    course.teacherId = teacher._id;
    await course.save();

    res.json({
      message: "Teacher assigned successfully",
      course
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET-ALL-COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 });

    res.json(courses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET-COURSE-BY-ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: "teacherId",
        populate: {
          path: "userId",
          select: "name email"
        }
      });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE-COURSE

exports.updateCourse = async (req, res) => {
  try {
    const { title, credits } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (title) course.title = title;
    if (credits) course.credits = credits;

    await course.save();

    res.json({
      message: "Course updated successfully",
      course
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE-COURSE
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      message: "Course deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};