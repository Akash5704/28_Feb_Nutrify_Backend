const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Fetch daily log for a specific date
router.get('/dailyLogs/:date', authenticateUser, async (req, res) => {
  try {
    const { date } = req.params;
    const dailyLog = req.user.dailyLogs.find(log => log.date.toISOString().split('T')[0] === date);

    if (!dailyLog) {
      return res.status(404).json({ message: 'No log found for this date' });
    }

    res.json(dailyLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add a meal to the daily log
router.post('/dailyLogs/meal', authenticateUser, async (req, res) => {
  try {
    const { date, meal } = req.body;
    let dailyLog = req.user.dailyLogs.find(log => log.date.toISOString().split('T')[0] === date);

    if (!dailyLog) {
      dailyLog = { date, meals: [] };
      req.user.dailyLogs.push(dailyLog);
    }

    dailyLog.meals.push(meal);
    await req.user.save();

    res.json({ message: 'Meal added successfully', dailyLog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
