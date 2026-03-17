const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
courseName: String,
courseCode: {
type: String,
unique: true
},
credits: Number,
teacherId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Teacher"
}
});

module.exports = mongoose.model("Course", courseSchema);
