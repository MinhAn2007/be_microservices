// routes/courses.js
const express = require("express");
const router = express.Router();
const Course = require("../models/course.js");
const Enrollment = require("../models/enrollment.js");
const UserCourse = require("../models/usercourse.js");

// Registration route
router.post("/register", async (req, res) => {
  const { userId, courseId, classId } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findOne({ course_id: courseId });
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
    const prerequisiteCourses = course.prerequisites;
    const userCourses = await UserCourse.find({ userId: userId });
    console.log("User Courses:", prerequisiteCourses);
    // Check if prerequisiteCourses is defined and iterable
    if (!prerequisiteCourses || !Symbol.iterator in Object(prerequisiteCourses)) {
        console.log("Prerequisite Courses: ", prerequisiteCourses);
        console.log("Prerequisite Courses are not defined or not iterable. Comparing directly with userCourses.");
        // Compare prerequisiteCourses directly with userCourses
        if (!userCourses.some(userCourse => userCourse.courseId && userCourse.courseId === prerequisiteCourses)) {
            console.log(`User has not completed prerequisite course: ${prerequisiteCourses}`);
            return res.status(400).json({ message: `User has not completed prerequisite course: ${prerequisiteCourses}` });
        }
    }
    
    console.log("Prerequisite Courses:", prerequisiteCourses);
    
    // Find user's enrolled courses
    
    // Log values for debugging
    console.log("User Courses:", userCourses);
    
    // Check if user has completed prerequisite courses
    for (const prerequisiteCourse of prerequisiteCourses) {
        console.log("Prerequisite Course check:", prerequisiteCourse);
        if (!userCourses.some(userCourse => userCourse.courseId && userCourse.courseId === prerequisiteCourse)) {
            console.log(`User has not completed prerequisite course: ${prerequisiteCourse}`);
            return res.status(400).json({ message: `User has not completed prerequisite course: ${prerequisiteCourse}` });
        }
    }
    
    // Check maximum capacity
    const classInfo = course.classes.find(cls => cls.class_id === classId);
    if (!classInfo) {
        return res.status(404).json({ message: "Class not found" });
    }

    if (classInfo.current_students >= classInfo.max_capacity) {
        return res.status(400).json({ message: "Class registration is full" });
    }

    // Create enrollment
    const enrollment = new Enrollment({
        userId: userId,
        courseId: courseId,
        classId: classId,
        status: "registered"
    });

    // Save enrollment
    await enrollment.save();

    // Update current_students count
    classInfo.current_students++;
    await course.save();

    res.status(201).json({ message: "Registration successful", enrollment });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
