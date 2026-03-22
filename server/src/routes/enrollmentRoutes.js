// routes/enrollmentRoutes.js

const express = require("express");
const router = express.Router();

const { enrollStudent, getAllEnrollments, updateEnrollment ,  removeEnrollment, getStudentsByCourse, getCoursesByStudent, } = require("../controllers/enrollmentController");


router.post("/", enrollStudent);
router.get("/", getAllEnrollments);
router.patch("/:id", updateEnrollment);
router.delete("/:id", removeEnrollment);
router.get("/courses/:id/students", getStudentsByCourse);
router.get("/students/:id/courses", getCoursesByStudent);

module.exports = router;