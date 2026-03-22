// routes/attendanceRoutes.js

const express = require("express");
const router = express.Router();

const {markAttendance,updateAttendance,deleteAttendance,getAllAttendance,getAttendanceByCourse,getAttendanceByStudent,
} = require("../controllers/attendanceController");

router.post("/attendance", markAttendance);
router.patch("/attendance/:id", updateAttendance);
router.delete("/attendance/:id", deleteAttendance);
router.get("/attendance", getAllAttendance);
router.get("/courses/:id/attendance", getAttendanceByCourse);
router.get("/students/:id/attendance", getAttendanceByStudent);


module.exports = router;