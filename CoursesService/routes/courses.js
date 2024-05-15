// routes/courses.js
const express = require("express");
const router = express.Router();
const Semester = require("../models/semester");
const Course = require("../models/course");
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
      console.log("semester status", semester.status);
      if (semester.status !== "open") {
        return res
          .status(403)
          .json({ message: "Bạn không được đăng kí trong kì này" });
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


module.exports = router;
