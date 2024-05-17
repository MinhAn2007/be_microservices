const express = require("express");
const router = express.Router();
const Course = require("../models/course.js");
const Enrollment = require("../models/enrollment.js");
const mailSender = require("../utils/mailSender.js");
const Semester = require("../models/semester.js");

// Registration route
router.post("/register", async (req, res) => {
  const {
    userId,
    coursesId,
    classId,
    semester: semesterName,
    email,
  } = req.body;
  console.log("Request body:", req.body);
  console.log("userId:", userId);
  console.log("courseId:", coursesId);
  console.log("classId:", classId);
  console.log("semester:", semesterName);

  try {
    const semester = await Semester.findOne({ semester_name: semesterName });
    console.log("Semester:", semester);
    const course = await Course.findOne({ course_id: coursesId });
    console.log("Course:", course);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const classInfo = course.classes.find((cls) => cls.class_id === classId);
    if (!classInfo) {
      return res.status(404).json({ message: "Class not found" });
    }
    console.log("Course ID:", semester.course_id);
    console.log("Course Input ID:", coursesId);
    if (classInfo.current_students >= course.max_students) {
      // Add student to the waiting list of the class
      const filterCourse = semester.courses.find(
        (course) => course.course_id === coursesId.toString()
      );
      console.log("Filter course:", filterCourse);
      if (filterCourse) {
        filterCourse.waitingList.push(userId);
      }
      await semester.save();

      // Find or create enrollment if it doesn't exist
      let enrollment = await Enrollment.findOne({ userId: userId });
      if (!enrollment) {
        enrollment = new Enrollment({
          userId: userId,
          enrolledCourses: [],
          semester: semester.semester_name,
        });
      }

      // Mark student as being in the waiting list
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
        $set: { semester: semester.semester_name },
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
        semester: semester.semester_name,
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
    const course = await Course.findOne({ course_id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
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
    const semesterDoc = await Semester.findOne({
      semester_name: enrollment.semester,
    });

    if (semesterDoc) {
      const filterCourse = semesterDoc.courses.find(
        (course) => course.course_id === courseId.toString()
      );
      if (filterCourse) {
        filterCourse.waitingList = filterCourse.waitingList.filter(
          (id) => id.toString() !== userId.toString()
        );
        await semesterDoc.save();
      }
    }

    if (waitingCourse) {
      console.log("Waiting course found:", waitingCourse);
      await sendVerificationEmail(
        email,
        `Bạn đã hủy đăng kí học phần ${courseId} thành công`
      );
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

    enrollment.enrolledCourses = enrollment.enrolledCourses.filter(
      (course) => !(course.courseId === courseId && course.classId === classId)
    );
    console.log(
      "Enrolled courses after unregistration:",
      enrollment.enrolledCourses
    );
    await enrollment.save();

    classInfo.current_students--;
    if (classInfo.current_students < 0) {
      classInfo.current_students = 0; // Đảm bảo số lượng sinh viên không bao giờ âm
    }
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
      "Mail thông báo đăng kí học phần",
      `<H1>Thông báo đăng kí học phần</H1>
      <p>${content}</p>`
    );
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
router.put("/close-semester/:semesterName", async (req, res) => {
  const { semesterName } = req.params;

  try {
    const semester = await Semester.findOneAndUpdate(
      { semester_name: semesterName },
      { status: "close" },
      { new: true }
    );
    console.log("Semester:", semester);
    if (!semester) {
      return res.status(404).send({ message: "Semester not found" });
    }

    const coursesWithWaitingList = semester.courses
      .filter((course) => course.waitingList.length > 0)
      .map((course) => course.course_id);

    const enrollments = await Enrollment.find({
      semester: semester.semester_name,
    });
    semester.courses.forEach((course) => {
      course.waitingList = [];
    });

    await semester.save();
    for (const enrollment of enrollments) {
      enrollment.enrolledCourses = enrollment.enrolledCourses.filter(
        (enrolledCourse) => {
          return !(
            coursesWithWaitingList.includes(enrolledCourse.courseId) &&
            enrolledCourse.isWaiting
          );
        }
      );
      console.log("courses:", semester.courses);

      await enrollment.save();
    }

    res.status(200).send({
      message:
        "Semester closed and waiting list courses cancelled successfully",
    });
  } catch (error) {
    console.log("Error occurred while closing semester:", error);
    res.status(500).send({ message: "Internal server error", error });
  }
});
module.exports = router;
