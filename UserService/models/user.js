const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  code: { type: String, required: true },
  full_name: { type: String, required: false }, // Không yêu cầu
  date_of_birth: { type: Date, required: false }, // Không yêu cầu
  gender: { type: String, required: false }, // Không yêu cầu
  address: { type: String, required: false }, // Không yêu cầu
  phone: { type: String, required: false }, // Không yêu cầu
  email: { type: String, required: false }, // Không yêu cầu
  avatar: { type: String },
  major: { type: String },
  faculty: { type: String },
  registrations: [
    {
      semester: { type: String, required: true },
      registered_credits: { type: Number, default: 0 },
    },
  ],
  credits_earned: { type: Number, default: 0 },
  gpa: { type: Number, default: 0 },
  courses: [
    {
      course_id: { type: String, required: true },
      course_name: { type: String, required: true },
      credits: { type: Number, required: true },
      grade: { type: String, required: true },
    },
  ],
  registration: [
    {
      course_id: { type: String, required: true },
      course_name: { type: String, required: true },
      registration_date: { type: Date, default: Date.now },
      status: { type: String, required: true },
      class_id: { type: String, required: true },
    },
  ],
  graduated: { type: Boolean, default: false },
  graduation_date: { type: Date },
  degree_info: {
    degree_title: { type: String },
    graduation_status: { type: String },
    completed_courses: [
      {
        course_id: { type: String, required: true },
        course_name: { type: String, required: true },
        credits: { type: Number, required: true },
        grade: { type: String, required: true },
      },
    ],
  },
  post_graduation_activities: [
    {
      activity_type: { type: String, required: true },
      details: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  can_use_info: { type: Boolean, default: false },
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
