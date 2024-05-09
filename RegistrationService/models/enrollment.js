const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' },
  grade: { type: Number } // Assuming grade will be stored here
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
