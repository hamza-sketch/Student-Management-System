const express = require("express");
const router = express.Router();

const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher
} = require("../controllers/teacherController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// Admin only
router.post("/", protect, authorizeRoles("admin"), createTeacher);
router.get("/", protect, authorizeRoles("admin"), getTeachers); 
router.get("/:id", protect, authorizeRoles("admin"), getTeacherById);
router.put("/:id", protect, authorizeRoles("admin"), updateTeacher);
router.delete("/:id", protect, authorizeRoles("admin"), deleteTeacher);

module.exports = router;