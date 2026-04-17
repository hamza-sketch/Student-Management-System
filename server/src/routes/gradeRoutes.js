// routes/gradeRoutes.js

const express = require("express");
const router = express.Router();

const {
  assignGrade,
  updateGrade,
  deleteGrade,
  getGradesByStudent,
  getGradesByCourse,
  getAllGrades,
} = require("../controllers/gradeController");

router.post("/grades", assignGrade);
router.patch("/grades/:id", updateGrade);
router.delete("/grades/:id", deleteGrade);
router.get("/grades", getAllGrades);
router.get("/students/:id/grades", getGradesByStudent);
router.get("/courses/:id/grades", getGradesByCourse);

module.exports = router;