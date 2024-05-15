// routes/courses.js
const express = require("express");
const router = express.Router();
const Course = require("../models/course.js");
const Enrollment = require("../models/enrollment.js");

// Registration route
router.post("/register", async (req, res) => {
  const { userId, coursesId, classId, semester } = req.body;
  console.log("Request body:", req.body);
  console.log("userId:", userId);
  console.log("courseId:", coursesId);
  console.log("classId:", classId);
  console.log("semester:", semester);
  try {
    const course = await Course.findOne({ course_id: coursesId });
    console.log("Course:", course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const classInfo = course.classes.find((cls) => cls.class_id === classId);
    if (!classInfo) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (classInfo.current_students >= course.max_students) {
      return res.status(400).json({ message: "Class is full" });
    }

     const existingEnrollment = await Enrollment.findOne({
      userId: userId,
      courseId: coursesId,
    });

    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: userId },
      {
        $addToSet: {
          enrolledCourses: {
            courseId: coursesId,
            classId: classId,
          },
        },
        $set: { semester: semester },
      },
      { upsert: true, new: true }
    );

    if (!enrollment) {
      // Create new enrollment if it doesn't exist
      const newEnrollment = new Enrollment({
        userId: userId,
        courseId: coursesId,
        enrolledCourses: [
          {
            courseId: coursesId,
            classId: classId,
          },
        ],
        semester: semester,
      });
      await newEnrollment.save();
    }

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
