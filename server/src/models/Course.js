const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    normalizedTitle:
    {
      type: String,
      required: true,
      trim: true,
      unique: true
    }, 

    credits: 
    {
      type: Number,
      required: true
    },
    teacherId: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);