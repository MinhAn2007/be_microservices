const Student = require("./UserService/models/user");
const connect = require('./UserService/database/db.js');
connect();
// Sample students data
const sampleStudents = [
  {
    role: "student",
    student_id: "1",
    full_name: "John Doe",
    date_of_birth: new Date("1995-01-01"),
    gender: "Male",
    address: "123 Main St, City",
    phone: "123-456-7890",
    email: "john@example.com",
    major: "Computer Science",
    faculty: "Engineering",
    credits_registered: 15,
    credits_earned: 12,
    gpa: 3.5,
    courses: [
      { course_id: "CSCI101", course_name: "Introduction to Computer Science", credits: 3, grade: "A" },
      { course_id: "CSCI102", course_name: "Data Structures", credits: 4, grade: "B" },
      { course_id: "CSCI201", course_name: "Algorithms", credits: 4, grade: "A" },
      { course_id: "CSCI301", course_name: "Database Systems", credits: 3, grade: "A" },
      { course_id: "CSCI401", course_name: "Software Engineering", credits: 4, grade: "B+" }
    ]
  },
  {
    role: "student",
    student_id: "2",
    full_name: "Jane Smith",
    date_of_birth: new Date("1997-05-15"),
    gender: "Female",
    address: "456 Oak St, Town",
    phone: "987-654-3210",
    email: "jane@example.com",
    major: "Electrical Engineering",
    faculty: "Engineering",
    credits_registered: 18,
    credits_earned: 15,
    gpa: 3.8,
    courses: [
      { course_id: "EE101", course_name: "Circuit Analysis", credits: 3, grade: "A" },
      { course_id: "EE201", course_name: "Electromagnetics", credits: 4, grade: "A-" },
      { course_id: "EE301", course_name: "Power Systems", credits: 4, grade: "B+" },
      { course_id: "EE401", course_name: "Control Systems", credits: 3, grade: "A" },
      { course_id: "EE402", course_name: "Digital Signal Processing", credits: 4, grade: "A" }
    ]
  },
  {
    role: "student",
    student_id: "3",
    full_name: "Michael Johnson",
    date_of_birth: new Date("1998-09-20"),
    gender: "Male",
    address: "789 Elm St, Village",
    phone: "555-555-5555",
    email: "michael@example.com",
    major: "Physics",
    faculty: "Science",
    credits_registered: 12,
    credits_earned: 9,
    gpa: 3.2,
    courses: [
      { course_id: "PHYS101", course_name: "Introduction to Physics", credits: 3, grade: "B" },
      { course_id: "PHYS201", course_name: "Classical Mechanics", credits: 4, grade: "B+" },
      { course_id: "PHYS301", course_name: "Quantum Mechanics", credits: 4, grade: "C" },
      { course_id: "PHYS401", course_name: "Electrodynamics", credits: 3, grade: "B" },
      { course_id: "PHYS402", course_name: "Statistical Mechanics", credits: 4, grade: "A-" }
    ]
  }
];
Student.insertMany(sampleStudents)
      .then((result) => {
        console.log('Data inserted successfully:', result);
      })
      .catch((err) => {
        console.error('Error inserting data:', err);
      });