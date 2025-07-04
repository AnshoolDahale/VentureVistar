const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getAvailableStartups } = require('../controller/connectionController');

// Get available startups for investors
router.get('/available', requireAuth, getAvailableStartups);

module.exports = router;