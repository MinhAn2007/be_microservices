// routes/courses.js
const express = require("express");
const router = express.Router();
const Course = require("../models/course.js");
const Enrollment = require("../models/enrollment.js");
const mailSender = require("../utils/mailSender.js");
// Registration route
router.post("/register", async (req, res) => {
  const { userId, coursesId, classId, semester, email } = req.body;
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
      // Thêm sinh viên vào danh sách chờ của lớp
      course.waitingList.push(userId);
      await course.save();

      // Khởi tạo enrollment
      let enrollment;

      // Tìm hoặc tạo enrollment nếu chưa tồn tại
      enrollment = await Enrollment.findOne({ userId: userId });
      if (!enrollment) {
        enrollment = new Enrollment({
          userId: userId,
          enrolledCourses: [],
          semester: semester,
        });
      }

      // Đánh dấu sinh viên là đang ở trong danh sách chờ
      enrollment.enrolledCourses.push({
        courseId: coursesId,
        classId: classId,
        isWaiting: true,
      });
      await enrollment.save();

      return res
        .status(400)
        .json({ message: "Class is full, student added to waiting list" });
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
    await sendVerificationEmail(
      email,
      `Bạn đã đăng kí học phần ${coursesId} thành công`
    );
    res.status(201).json({ message: "Registration successful", enrollment });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/unregister", async (req, res) => {
  const { userId, courseId, classId, email } = req.body;
  console.log("Request body:", req.body);
  console.log("userId:", userId);
  console.log("courseId:", courseId);
  console.log("classId:", classId);
  console.log("email:", email);
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
    const enrollment = await Enrollment.findOne({ userId: userId });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    console.log("Enrollment:", enrollment);
    console.log("Enrolled courses:", enrollment.enrolledCourses);
    console.log("Course ID:", courseId);
    console.log("Class ID:", classId);

    const waitingCourse = enrollment.enrolledCourses.find(
      (course) =>
        course.courseId === courseId &&
        course.classId === classId &&
        course.isWaiting
    );
    if (waitingCourse) {
      console.log("Waiting course found:", waitingCourse);
      await sendVerificationEmail(
        email,
        `Bạn đã hủy đăng kí học phần ${courseId} thành công`
      );
      // Remove the course from enrolledCourses
      enrollment.enrolledCourses = enrollment.enrolledCourses.filter(
        (course) =>
          !(course.courseId === courseId && course.classId === classId)
      );
      console.log(
        "Enrolled courses after unregistration:",
        enrollment.enrolledCourses
      );
      await enrollment.save();
      return res.status(200).json({
        message: "Unregistration successful",
        enrollment,
        waitingCourse,
      });
    }
    // Remove the course from enrolledCourses
    enrollment.enrolledCourses = enrollment.enrolledCourses.filter(
      (course) => !(course.courseId === courseId && course.classId === classId)
    );
    console.log(
      "Enrolled courses after unregistration:",
      enrollment.enrolledCourses
    );
    await enrollment.save();

    // Giảm số lượng sinh viên hiện tại trong lớp
    classInfo.current_students--;
    await course.save();
    await sendVerificationEmail(
      email,
      `Bạn đã hủy đăng kí học phần ${courseId} thành công`
    );

    res.status(200).json({ message: "Unregistration successful", enrollment });
  } catch (error) {
    console.error("Error occurred during unregistration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

async function sendVerificationEmail(email, content) {
  try {
    const mailResponse = await mailSender(
      email,
      "Mail thông báo đăng kí học phân",
      `<H1>Thông báo đăng kí học phần</H1>
      <p>${content}</p>`
    );
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
module.exports = router;
