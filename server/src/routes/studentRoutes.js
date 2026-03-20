const express = require("express");
const router = express.Router();

const { createStudent, getStudents, getStudentById, updateStudent, deleteStudent,  } = require("../controllers/studentController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

router.post("/", protect, authorizeRoles("admin"), createStudent);
router.get("/", protect, authorizeRoles("admin"), getStudents);
router.get("/:id", protect, authorizeRoles("admin"), getStudentById);
router.put("/:id", protect, authorizeRoles("admin"), updateStudent);
router.delete("/:id", protect, authorizeRoles("admin"), deleteStudent);

module.exports = router;