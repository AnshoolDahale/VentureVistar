const express = require('express');
const Announcement = require('../models/Announcement');
const router = express.Router();

router.get('/', async (req, res) => {
  const announcements = await Announcement.find().sort({ date: -1 });
  res.json(announcements);
});

module.exports = router; 