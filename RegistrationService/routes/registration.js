const express = require("express");
const router = express.Router();
const Course = require("../models/course.js");
const Enrollment = require("../models/enrollment.js");
const UserCourse = require("../models/usercourse.js");

// Registration route
router.post("/register", async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    console.log("Course:", course);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the user is already enrolled in this course
    const existingEnrollment = await Enrollment.findOne({ userId: userId, courseId: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "User is already enrolled in this course" });
    }

    // Find prerequisite courses
    const prerequisiteCourses = await Course.find({ _id: { $in: course.prerequisites } });

    // Find user's enrolled courses
    const userCourses = await UserCourse.find({ userId: userId });

    // Log values for debugging
    console.log("Prerequisite Courses:", prerequisiteCourses);
    console.log("User Courses:", userCourses);

    // Check if user has completed prerequisite courses
    for (const prerequisiteCourse of prerequisiteCourses) {
      if (!userCourses.some(userCourse => userCourse.courseId && userCourse.courseId.toString() === prerequisiteCourse._id.toString())) {
      console.log(`User has not completed prerequisite course: ${prerequisiteCourse.name}`);
      return res.status(400).json({ message: `User has not completed prerequisite course: ${prerequisiteCourse.name}` });
      }
    }

    // Check maximum capacity
    if (course.enrolledStudents >= course.maxCapacity) {
      return res.status(400).json({ message: "Course registration is full" });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      userId: userId,
      courseId: courseId,
      status: "registered"
    });

    // Save enrollment
    await enrollment.save();

    // Update enrolledStudents count
    course.enrolledStudents++;
    await course.save();

    res.status(201).json({ message: "Registration successful", enrollment });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
