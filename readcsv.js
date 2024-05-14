const connect = require('./CoursesService/database/db.js');
const Enrollment = require('./CoursesService/models/enrollment.js');
connect();
// Sample students data
const studentData = {
  userId: "20040301",
  enrolledCourses: [
    { courseId: "MECH101", classId: "MECH101-01" },
    { courseId: "MECH201", classId: "MECH201-02" }
    // Add more enrolled courses if needed
  ],
  status: "registered",
  semester: "Spring 2024"
};

Enrollment.insertMany(studentData)
      .then((result) => {
        console.log('Data inserted successfully:', result);
      })
      .catch((err) => {
        console.error('Error inserting data:', err);
      });