

const express = require("express");
const router = express.Router();

const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse , assignTeacher} = require("../controllers/courseController");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/", protect, authorizeRoles("admin"), createCourse);
router.get("/", protect, authorizeRoles("admin"), getCourses);
router.get("/:id", protect, authorizeRoles("admin"), getCourseById);
router.put("/:id", protect, authorizeRoles("admin"), updateCourse);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCourse);
router.put("/:id/assign-teacher", protect, authorizeRoles("admin"), assignTeacher);

module.exports = router;