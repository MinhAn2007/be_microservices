const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
  semester_name: { type: String, required: true },
  courses: [
    {
      course_id: { type: String, ref: "Course" },
      department: { type: String, required: true }, 
      waitingList: [{ type: String }],
    },
  ],
  status: { type: String, enum: ["open", "close"], default: "close" },
});

const Semester = mongoose.model("Semester", semesterSchema);

module.exports = Semester;
