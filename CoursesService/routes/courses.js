// routes/courses.js
const express = require("express");
const router = express.Router();
const Semester = require("../models/semester");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
// Registration route
router.get(
  "/:semesterName/departments/:department/courses",
  async (req, res) => {
    try {
      const { semesterName, department } = req.params;
      console.log("semesterName", semesterName);
      console.log("department", department);
      const semester = await Semester.findOne({
        semester_name: semesterName,
      }).populate({
        path: "courses.course_id",
        match: { department: department },
      });
      console.log("semester", semester);
      if (!semester) {
        return res.status(404).json({ message: "Semester not found" });
      }
      const filteredCourses = semester.courses.filter(
        (course) => course.department === department
      );
      console.log("filteredCourses", filteredCourses);
      const courseIds = filteredCourses.map((course) => course._id);
      const courses = await Course.find({ _id: { $in: courseIds } });
      console.log("courseIds", courseIds);
      console.log("courses", courses);
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);
router.get("/departments/:department", async (req, res) => {
  try {
    const { department } = req.params;

    // Find all courses for the specified department
    const courses = await Course.find({ department });

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by department:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/:courseId/classes", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { newClasses } = req.body;

    const course = await Course.findOne({ course_id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    console.log("course", course);
    console.log("newClasses", newClasses);
    // Add semester ID to each new class

    // Initialize course.classes if it's undefined
    if (!course.classes) {
      course.classes = [];
    }

    // Add new classes to the course
    course.classes.push(...newClasses);

    // Save the updated course
    await course.save();

    res.json(course);
  } catch (error) {
    console.error("Error adding classes to course:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
router.get("/classes/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findOne({ course_id: courseId }).exec();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const maxStudents = course.max_students;

    // Lấy danh sách các lớp học
    const classes = course.classes.map((classItem) => ({
      ...classItem.toObject(), // Convert Mongoose document to plain JavaScript object
      max_students: maxStudents, // Gắn max_students vào mỗi lớp học
    }));
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/classes/:userId/:semester", async (req, res) => {
  try {
    const { userId, semester } = req.params;

    // Tìm tất cả các bản ghi Enrollment của sinh viên với semester cụ thể
    const enrollments = await Enrollment.find({ userId, semester });

    // Trích xuất danh sách các courseIds từ các bản ghi Enrollment
    const enrolledCourses = enrollments.map(
      (enrollment) => enrollment.enrolledCourses
    );

    res.json({ enrolledCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
router.get('/enrolled/:userId/:semester', async (req, res) => {
  try {
    const { userId, semester } = req.params;

    // Find enrollments matching the provided user ID and semester
    const enrollments = await Enrollment.find({ userId, semester });

    // Initialize an array to store enrolled courses and classes
    let enrolledCoursesAndClasses = [];

    // Iterate through each enrollment
    for (const enrollment of enrollments) {
      // Extract enrolled courses and classes from each enrollment
      const { enrolledCourses } = enrollment;

      // Iterate through each enrolled course
      for (const course of enrolledCourses) {
        // Find the course details using courseId
        const enrolledCourse = await Course.findOne({ course_id: course.courseId });

        // If the enrolled course is found, add it to the result array
        if (enrolledCourse) {
          // Extract the class details using classId from the enrolled course
          const enrolledClass = enrolledCourse.classes.find(cls => cls.class_id === course.classId);
          enrolledCoursesAndClasses.push({
            course: enrolledCourse,
            class: enrolledClass
          });
        }
      }
    }

    // Return the enrolled courses and classes
    res.json(enrolledCoursesAndClasses);
  } catch (error) {
    console.error('Error fetching enrolled courses and classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
