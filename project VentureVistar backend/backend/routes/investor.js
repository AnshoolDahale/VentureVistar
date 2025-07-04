const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get suggested investors for a startup (mocked for now)
router.get('/suggestions', async (req, res) => {
  // In a real app, filter by industry, stage, etc.
  const investors = await User.find({ userType: 'investor' }).limit(5);
  res.json(investors);
});

module.exports = router; 