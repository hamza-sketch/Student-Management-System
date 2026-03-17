const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
studentId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Student"
},
courseId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Course"
},
date: Date,
status: String
});

module.exports = mongoose.model("Attendance", attendanceSchema);
