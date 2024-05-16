const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  credits: { type: Number, required: true },
  max_students: { type: Number, required: true },
  is_chosen: { type: Boolean, required: true },
  prerequisites: { type: Array, required: true },
  classes: [
    {
      class_id: { type: String, required: true },
      schedule: { type: String, required: true },
      instructor: { type: String, required: true },
      current_students: { type: Number, required: true },
      schedule_theory: { type: String, required: true },
      schedule_lab: { type: String, required: true },
      is_blocked: { type: Boolean, required: true },
      semester_id: { type: String, required: true },
      start_date: { type: Date, required: true },
      end_date: { type: Date, required: true } ,
    },

  ],

});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
