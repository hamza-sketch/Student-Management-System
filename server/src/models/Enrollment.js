const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
studentId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Student"
},
courseId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Course"
},
enrollmentDate: Date,
status: String
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
