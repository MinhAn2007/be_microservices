// routes/courses.js
const express = require("express");
const router = express.Router();
const Semester = require("../models/semester");
const Course = require("../models/course");
// Registration route
router.get("/:semesterName/departments/:department/courses", async (req, res) => {
  try {
    const { semesterName, department } = req.params;
    console.log("semesterName", semesterName);
    console.log("department", department);
    const semester = await Semester.findOne({ semester_name: semesterName }).populate({
      path: 'courses.course_id',
      match: { department: department },
    });
    console.log("semester", semester);
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }
    const filteredCourses = semester.courses.filter(course => course.department === department);

    const courseIds = filteredCourses.map(course => course._id);
    const courses = await Course.find({ _id: { $in: courseIds } });
    console.log("courseIds", courseIds);
    console.log("courses", courses);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});
router.get("/departments/:department", async (req, res) => {
  try {
    const { department } = req.params;
    
    // Find all courses for the specified department
    const courses = await Course.find({ department });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses by department:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post("/:courseId/classes", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { newClasses } = req.body;

    const course = await Course.findOne({ course_id: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
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
    console.error('Error adding classes to course:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
