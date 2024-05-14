const mongoose = require('mongoose');
const Course = require('./course');

const userCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.String, ref: 'User', required: true }, // Reference to the user
  courseId: { type: mongoose.Schema.Types.String, ref: 'Course', required: true }, // Reference to the course
  confirmed: { type: Boolean, default: false }, // Xác nhận trước khi đăng ký
});

// Validator để kiểm tra số lượng tín chỉ của sinh viên trong một học kỳ
userCourseSchema.pre('save', async function(next) {
  const userId = this.userId;
  const courseId = this.courseId;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Không tìm thấy thông tin môn học');
    }

    let totalCredits = 0;
    totalCredits += course.credits;
  

    // Kiểm tra số  tín chỉ
    if (totalCredits > 30) {
      console.log('totalCredits: ', totalCredits);
      throw new Error('Sinh viên đã đăng ký quá số tín chỉ cho học kỳ này');
    }
    console.log('Số tín chỉ hiện tại: ', totalCredits);
    next();
  } catch (error) {
    next(error);
  }
});

const UserCourse = mongoose.model('UserCourse', userCourseSchema);

module.exports = UserCourse;
