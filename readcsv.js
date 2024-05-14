const Student = require("./UserService/models/user");
const connect = require('./UserService/database/db.js');
connect();
// Sample students data
const studentData = {
  role: "student",
  student_id: "5",
  full_name: "Bob Williams",
  date_of_birth: new Date("1999-08-25"),
  gender: "Male",
  address: "321 Maple St, Rural",
  phone: "777-777-7777",
  email: "bob@example.com",
  major: "Mechanical Engineering",
  faculty: "Engineering",
  credits_registered: 120, // Số tín chỉ đã đăng ký
  credits_earned: 120, // Số tín chỉ đã hoàn thành
  gpa: 3.7, // Điểm trung bình tích lũy
  courses: [
    { course_id: "MECH101", course_name: "Introduction to Mechanical Engineering", credits: 3, grade: "A" },
    { course_id: "MECH201", course_name: "Engineering Thermodynamics", credits: 4, grade: "B+" },
    // Danh sách các môn đã hoàn thành
  ]
};

Student.insertMany(studentData)
      .then((result) => {
        console.log('Data inserted successfully:', result);
      })
      .catch((err) => {
        console.error('Error inserting data:', err);
      });