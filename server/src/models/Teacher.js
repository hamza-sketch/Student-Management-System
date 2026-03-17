const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},
designation: String,
phone: String
});

module.exports = mongoose.model("Teacher", teacherSchema);
