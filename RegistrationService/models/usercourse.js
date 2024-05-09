const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to the course
});

const UserCourse = mongoose.model('UserCourse', userCourseSchema);

module.exports = UserCourse;
