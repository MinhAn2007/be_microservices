const connect = require("./CoursesService/database/db.js");
const Course = require("./CoursesService/models/course.js");
connect();

// Sample data for courses
const coursesData = [
  {
    course_id: "CSE101",
    name: "Introduction to Computer Science",
    department: "CSE",
    credits: 3,
    max_students: 50,
    is_chosen: true,
    prerequisites: [],
    classes: [
      {
        class_id: "CSE101-01",
        schedule: "Monday, Wednesday, Friday 10:00 AM - 11:30 AM",
        instructor: "Dr. John Doe",
        current_students: 0,
        schedule_theory: "MW 10:00 AM - 11:00 AM",
        schedule_lab: "F 10:00 AM - 11:30 AM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
      {
        class_id: "CSE101-02",
        schedule: "Tuesday, Thursday 9:00 AM - 10:30 AM",
        instructor: "Dr. Jane Smith",
        current_students: 0,
        schedule_theory: "TT 9:00 AM - 10:00 AM",
        schedule_lab: "T 10:00 AM - 11:30 AM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
      {
        class_id: "CSE101-03",
        schedule: "Tuesday, Thursday 1:00 PM - 2:30 PM",
        instructor: "Prof. Michael Johnson",
        current_students: 0,
        schedule_theory: "TT 1:00 PM - 2:00 PM",
        schedule_lab: "T 2:00 PM - 3:30 PM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
    ],
  },
  // Add more courses if needed
  {
    course_id: "CSE102",
    name: "Data Structures and Algorithms",
    department: "CSE",
    credits: 3,
    max_students: 50,
    is_chosen: true,
    prerequisites: ["CSE101"],
    classes: [
      {
        class_id: "CSE102-01",
        schedule: "Monday, Wednesday, Friday 10:00 AM - 11:30 AM",
        instructor: "Dr. Sarah Williams",
        current_students: 0,
        schedule_theory: "MW 10:00 AM - 11:00 AM",
        schedule_lab: "F 10:00 AM - 11:30 AM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
      {
        class_id: "CSE102-02",
        schedule: "Tuesday, Thursday 9:00 AM - 10:30 AM",
        instructor: "Prof. James Brown",
        current_students: 0,
        schedule_theory: "TT 9:00 AM - 10:00 AM",
        schedule_lab: "T 10:00 AM - 11:30 AM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
      {
        class_id: "CSE102-03",
        schedule: "Tuesday, Thursday 1:00 PM - 2:30 PM",
        instructor: "Dr. Emily Davis",
        current_students: 0,
        schedule_theory: "TT 1:00 PM - 2:00 PM",
        schedule_lab: "T 2:00 PM - 3:30 PM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
    ],
  },
  {
    course_id: "CSE103",
    name: "Object-Oriented Programming",
    department: "CSE",
    credits: 3,
    max_students: 50,
    is_chosen: true,
    prerequisites: ["CSE101"],
    classes: [
      {
        class_id: "CSE103-01",
        schedule: "Monday, Wednesday, Friday 8:00 AM - 9:30 AM",
        instructor: "Prof. John Smith",
        current_students: 0,
        schedule_theory: "MWF 8:00 AM - 9:00 AM",
        schedule_lab: "F 9:00 AM - 10:30 AM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
      {
        class_id: "CSE103-02",
        schedule: "Tuesday, Thursday 2:00 PM - 3:30 PM",
        instructor: "Dr. Jessica Johnson",
        current_students: 0,
        schedule_theory: "TT 2:00 PM - 3:00 PM",
        schedule_lab: "T 3:00 PM - 4:30 PM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
      {
        class_id: "CSE103-03",
        schedule: "Tuesday, Thursday 10:00 AM - 11:30 AM",
        instructor: "Prof. Michael Brown",
        current_students: 0,
        schedule_theory: "TT 10:00 AM - 11:00 AM",
        schedule_lab: "T 11:00 AM - 12:30 PM",
        is_blocked: false,
        start_date: new Date(),
        end_date: new Date(),
        semester_id: "Spring 2024", // Semester ID
      },
    ],
  },
];

// Insert courses data into the database
Course.insertMany(coursesData)
  .then((result) => {
    console.log("Courses inserted successfully:", result);
  })
  .catch((err) => {
    console.error("Error inserting courses data:", err);
  });
