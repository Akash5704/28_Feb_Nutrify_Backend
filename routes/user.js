const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const authenticateUser = require('../middleware/authMiddleware')
const router = express.Router();

// Health check route
router.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is alive!" });
});

router.post("/signup", async (req, res) => {
    try {
        const { email, password, Goal, TargetWeight, WeightSpeed, DietType, ...otherUserData } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const newUser = new User({
            email,
            password: hashedPassword,
            Goal,
            TargetWeight,
            WeightSpeed,
            DietType,
            ...otherUserData,
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// // Add Daily Log
// router.post('/daily-log', async (req, res) => {
//   try {
//     const { userId, log } = req.body;
//     let user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.dailyLogs.push(log);
//     await user.save();

//     res.json({ message: "Daily log added", logs: user.dailyLogs });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

router.post('/daily-log', authenticateUser, async (req, res) => {
  try {
      const { log } = req.body;
      let user = await User.findById(req.user.id); // Extract user ID from token

      if (!user) return res.status(404).json({ message: "User not found" });

      user.dailyLogs.push(log);
      await user.save();

      res.json({ message: "Daily log added", logs: user.dailyLogs });
  } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Get Daily Logs
router.get('/daily-log/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.dailyLogs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
