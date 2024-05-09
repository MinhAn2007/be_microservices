const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  credits: { type: Number, required: true },
  prerequisites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // Array of prerequisite courses
  maxCapacity: { type: Number, required: true }, // Maximum capacity for the course
  enrolledStudents: { type: Number, default: 0 }, // Number of students currently enrolled
  isOpen: { type: Boolean, default: false }, // Flag to indicate whether the course is open or closed
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
