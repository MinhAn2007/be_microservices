const express = require("express");
const router = express.Router();
const Student = require("../models/user");

// Get student's general information
router.get("/:code", async (req, res) => {
  try {
    const student = await Student.findOne({ code: { $in: [req.params.id] } });
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
router.post("/student/:id/graduate", async (req, res) => {
  try {
    const REQUIRED_CREDITS = 120; // Example required credits for graduation
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.credits_earned >= REQUIRED_CREDITS) {
      student.graduated = true;
      await student.save();
      res.json({ message: "Graduation registered successfully" });
    } else {
      res.status(400).json({ message: "Not enough credits earned" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
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

module.exports = router;
