const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
studentId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Student"
},
courseId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Course"
},
marks: Number,
grade: String,
semester: String
});

module.exports = mongoose.model("Grade", gradeSchema);
