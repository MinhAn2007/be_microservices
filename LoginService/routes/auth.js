const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Convert username and password to lowercase for case-insensitive comparison

    // Find the user by lowercase username and password
    const user = await User.findOne({
      username,password
    });

    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      console.log("Invalid username or password");
      console.log("username:", username);
      console.log("password:", password);
      console.log("req.body:", req.body);
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error occurred during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
