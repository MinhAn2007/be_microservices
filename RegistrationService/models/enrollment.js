const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.String, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.String, ref: 'Course', required: true },
  classId: { type: String, required: true },
  status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' },
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
