const express = require("express");
const router = express.Router();
const Semester = require("../models/semester");
const Course = require("../models/course");
const Enrollment = require("../models/enrollment");
router.post("/:courseId/class", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { newClass } = req.body;

    const course = await Course.findOne({ course_id: courseId });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("course", course);
    console.log("newClass", newClass);

    // Khởi tạo course.classes nếu nó chưa được định nghĩa
    if (!course.classes) {
      course.classes = [];
    }

    // Thêm lớp mới vào mảng classes của khóa học

    // Cập nhật số lượng học sinh hiện tại của lớp mới
    newClass.current_students = 0;

    // Lấy danh sách chờ của môn học trong học kỳ
    const semester = await Semester.findOne({
      semester_name: newClass.semester_id,
    });
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    const courseInSemesterIndex = semester.courses.findIndex(
      (course) => course.course_id.toString() === courseId
    );

    if (courseInSemesterIndex === -1) {
      return res.status(404).json({ message: "Course not found in semester" });
    }

    // Lấy danh sách sinh viên từ danh sách chờ của môn học
    const studentsToAdd = semester.courses[courseInSemesterIndex].waitingList;
    console.log("studentsToAdd", studentsToAdd);
    // Thêm số lượng sinh viên từ danh sách chờ vào current_students
    const availableSeats = course.max_students - newClass.current_students;
    console.log("availableSeats", availableSeats);
    const numberOfStudentsToAdd = Math.min(
      availableSeats,
      studentsToAdd.length
    );
    console.log("numberOfStudentsToAdd", numberOfStudentsToAdd);
    newClass.current_students = numberOfStudentsToAdd;
    console.log("newClass.current_students", newClass.current_students);
    course.classes.push(newClass);
    semester.courses[courseInSemesterIndex].waitingList = studentsToAdd.slice(
      numberOfStudentsToAdd
    );

    // Cập nhật thông tin đăng ký học phần của các sinh viên
    for (const studentId of studentsToAdd.slice(0, numberOfStudentsToAdd)) {
      const existingEnrollment = await Enrollment.findOne({
        userId: studentId,
        "enrolledCourses.courseId": courseId,
        status: "registered",
      });
      console.log("existingEnrollment", existingEnrollment);
      if (existingEnrollment) {
        // Tìm lớp học chứa courseId cụ thể trong mảng enrolledCourses
        const courseIndex = existingEnrollment.enrolledCourses.findIndex(
          (course) => course.courseId === courseId
        );

        // Kiểm tra xem courseId có tồn tại trong mảng enrolledCourses hay không
        if (courseIndex !== -1) {
          // Xóa lớp học chứa courseId cụ thể ra khỏi mảng enrolledCourses
          existingEnrollment.enrolledCourses.splice(courseIndex, 1);
          console.log("existingEnrollment after splice", existingEnrollment);
          // Lưu lại bản ghi Enrollment sau khi xóa
          await existingEnrollment.save();

          console.log(
            `Cancelled enrollment for user ${studentId} in course ${courseId}`
          );
        }
      }
      const enrollment = await Enrollment.findOneAndUpdate(
        { userId: studentId },
        {
          $addToSet: {
            enrolledCourses: {
              courseId: courseId,
              classId: newClass.class_id,
            },
          },
          $set: { semester: newClass.semester_id },
        },
        { upsert: true, new: true }
      );

      if (!enrollment) {
        // Create new enrollment if it doesn't exist
        const newEnrollment = new Enrollment({
          userId: studentId,
          courseId: courseId,
          enrolledCourses: [
            {
              courseId: courseId,
              classId: newClass.class_id,
            },
          ],
          semester: newClass.semester_id,
        });
        await newEnrollment.save();
      }
    }

    // Lưu khóa học đã được cập nhật
    await course.save();
    await semester.save();

    res.json(course);
  } catch (error) {
    console.error("Error adding class to course:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/classes/:courseId/:semester", async (req, res) => {
  try {
    const { courseId, semester } = req.params;
    const course = await Course.findOne({ course_id: courseId }).exec();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const maxStudents = course.max_students;

    // Lấy danh sách các lớp học
    console.log("course", course);
    console.log("course.classes", course.classes);
    console.log("maxStudents", maxStudents);
    console.log("semester", semester);
    const classes = course.classes.map((classItem) => ({
      ...classItem.toObject(),
      max_students: maxStudents,
    }));
    const semesterClasses = classes.filter(
      (classItem) => classItem.semester_id === semester
    );
    console.log("classes", semesterClasses);
    res.json(semesterClasses);
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
router.get("/enrolled/:userId/:semester", async (req, res) => {
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
        const enrolledCourse = await Course.findOne({
          course_id: course.courseId,
        });

        // If the enrolled course is found, add it to the result array
        if (enrolledCourse) {
          // Extract the class details using classId from the enrolled course
          const enrolledClass = enrolledCourse.classes.find(
            (cls) => cls.class_id === course.classId
          );
          enrolledCoursesAndClasses.push({
            course: enrolledCourse,
            class: enrolledClass,
          });
        }
      }
    }

    // Return the enrolled courses and classes
    res.json(enrolledCoursesAndClasses);
  } catch (error) {
    console.error("Error fetching enrolled courses and classes:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/classes/:classId/block", async (req, res) => {
  try {
    const { classId } = req.params;
    const { isBlocked } = req.body;

    // Tìm khóa học chứa lớp học cần cập nhật
    const course = await Course.findOne({ "classes.class_id": classId });
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course containing class not found" });
    }

    // Tìm lớp học trong danh sách các lớp của khóa học
    const classToUpdate = course.classes.find(
      (cls) => cls.class_id === classId
    );
    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found in course" });
    }

    // Cập nhật trạng thái is_blocked của lớp học
    classToUpdate.is_blocked = isBlocked;

    // Lưu khóa học đã được cập nhật
    await course.save();

    res.json({ message: "Khoá lớp thành công" });
  } catch (error) {
    console.error("Error updating class is_blocked:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
module.exports = router;
