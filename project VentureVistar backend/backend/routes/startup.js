const express = require('express');
const StartupProfile = require('../models/StartupProfile');
const FundraisingCampaign = require('../models/FundraisingCampaign');
const Milestone = require('../models/Milestone');
const Meeting = require('../models/Meeting');
const Document = require('../models/Document');
const { requireAuth } = require('../middleware/auth'); // You may need to implement this
const router = express.Router();

// --- Profile ---
router.get('/profile', requireAuth, async (req, res) => {
  const profile = await StartupProfile.findOne({ user: req.user._id });
  res.json(profile);
});
router.put('/profile', requireAuth, async (req, res) => {
  const updated = await StartupProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...req.body },
    { new: true, upsert: true }
  );
  res.json(updated);
});

// --- Fundraising ---
router.get('/fundraising', requireAuth, async (req, res) => {
  const campaigns = await FundraisingCampaign.find({ startup: req.user._id });
  res.json(campaigns);
});
router.post('/fundraising', requireAuth, async (req, res) => {
  const campaign = await FundraisingCampaign.create({ ...req.body, startup: req.user._id });
  res.status(201).json(campaign);
});

// --- Milestones ---
router.get('/milestones', requireAuth, async (req, res) => {
  const milestones = await Milestone.find({ startup: req.user._id });
  res.json(milestones);
});
router.post('/milestones', requireAuth, async (req, res) => {
  const milestone = await Milestone.create({ ...req.body, startup: req.user._id });
  res.status(201).json(milestone);
});

// --- Meetings ---
router.get('/meetings', requireAuth, async (req, res) => {
  const meetings = await Meeting.find({ startup: req.user._id });
  res.json(meetings);
});
router.post('/meetings', requireAuth, async (req, res) => {
  const meeting = await Meeting.create({ ...req.body, startup: req.user._id });
  res.status(201).json(meeting);
});

// --- Documents ---
router.get('/documents', requireAuth, async (req, res) => {
  const docs = await Document.find({ startup: req.user._id });
  res.json(docs);
});
router.post('/documents', requireAuth, async (req, res) => {
  const doc = await Document.create({ ...req.body, startup: req.user._id });
  res.status(201).json(doc);
});

module.exports = router; 