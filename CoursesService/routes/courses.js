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


router.get("/departments", async (req, res) => {
  try {
    // Find distinct departments from courses
    const departments = await Course.distinct("department");
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error getting departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/waitinglist/:courseId/:semesterName", async (req, res) => {
  try {
    const { courseId, semesterName } = req.params;

    // Find the semester based on semester name
    const semester = await Semester.findOne({ semester_name: semesterName });

    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    // Find the course in the semester's courses array
    const course = semester.courses.find(
      (course) => course.course_id === courseId
    );

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found in this semester" });
    }

    // Return the waiting list for the course
    res.json({ waitingList: course.waitingList });
  } catch (error) {
    console.error("Error fetching waiting list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
