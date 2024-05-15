const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  semester_name: { type: String, required: true }, // Tên của học kỳ
  courses: [
    {
      course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Tham chiếu tới môn học
      department: { type: String, required: true }, // Khoa của môn học
    }
  ],
  status : { type: String, enum: ['open', 'close'], default: 'close' }, 
});

const Semester = mongoose.model('Semester', semesterSchema);

module.exports = Semester;
