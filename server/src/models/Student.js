 
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
userId: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},
registrationNumber: {
type: String,
unique: true
},
dateOfBirth: Date,
gender: String,
phone: String,
address: String
});

module.exports = mongoose.model("Student", studentSchema);
