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
router.post("/unregister", async (req, res) => {
  const { userId, courseId, classId } = req.body;
  console.log("Request body:", req.body);
  console.log("userId:", userId);
  console.log("courseId:", courseId);
  console.log("classId:", classId);
  try {
    // Kiểm tra xem môn học tồn tại hay không
    const course = await Course.findOne({ course_id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Kiểm tra xem lớp học tồn tại trong môn học hay không
    const classInfo = course.classes.find((cls) => cls.class_id === classId);
    if (!classInfo) {
      return res.status(404).json({ message: "Class not found" });
    }
    // Tìm và xóa đăng ký
    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: userId },
      {
        $pull: {
          enrolledCourses: {
            courseId: courseId,
            classId: classId,
          },
        },
      },
      { new: true }
    );
    // Nếu không tìm thấy đăng ký, trả về lỗi
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    // Giảm số lượng sinh viên hiện tại trong lớp
    classInfo.current_students--;
    await course.save();
    res.status(200).json({ message: "Unregistration successful", enrollment });
  } catch (error) {
    console.error("Error occurred during unregistration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
