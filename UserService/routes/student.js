const express = require("express");
const router = express.Router();
const Student = require("../models/user");

// Get student's general information
router.get("/:code", async (req, res) => {
  try {
    const student = await Student.findOne({ code: req.params.code });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get student's academic information
router.get("/academic/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({
      credits_earned: student.credits_earned,
      courses: student.courses,
      gpa: student.gpa,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Register for graduation
router.post("/students/:id/graduate", async (req, res) => {
  try {
    const { faculty } = req.body;
    const REQUIRED_CREDITS = faculty === "Engineering" ? 150 : 120;
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (student.credits_earned < REQUIRED_CREDITS) {
      return res.status(400).json({
        error: "Insufficient credits earned for graduation",
        remaining_credits: REQUIRED_CREDITS - student.credits_earned,
      });
    }

    const graduationMonth = [2, 5, 8, 11][Math.floor(Math.random() * 4)];
    const graduationDay = Math.floor(Math.random() * 28) + 1;
    const graduationYear = new Date().getFullYear();
    student.graduated = true;
    student.degree_info = {
      degree_title: "Bachelor of Science in Computer Science",
      graduation_status: "Completed",
    };
    student.graduation_date = new Date(graduationYear, graduationMonth, graduationDay);

    await student.save();

    res.status(200).json({
      message: "Graduation registered successfully",
      graduation_date: student.graduation_date,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get alumni information
router.get("/alumni", async (req, res) => {
  try {
    const alumni = await Student.find({ graduated: true });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update post-graduation activities
router.put("/student/:id/post_graduation_activities", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.post_graduation_activities.push(req.body);
    await student.save();
    res.json({ message: "Post-graduation activity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.put("/:code/registration/:semester", async (req, res) => {
  try {
    const { registeredCredits } = req.body;
    const { code, semester } = req.params;

    // Find the user by code
    const user = await Student.findOne({ code });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the registration for the specified semester
    const registration = user.registrations.find(
      (reg) => reg.semester === semester
    );
    if (!registration) {
      return res
        .status(404)
        .json({ message: "Registration for the semester not found" });
    }

    // Update the registered credits for the semester
    registration.registered_credits = registeredCredits;

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user data
    res.json(updatedUser);
  } catch (error) {
    // Handle errors
    console.error("Error updating registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
});




module.exports = router;
