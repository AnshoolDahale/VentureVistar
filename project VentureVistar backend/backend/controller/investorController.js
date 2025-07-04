const Investor = require('../models/investorModel');
const Startup = require('../models/StartupProfile');
const asyncHandler = require('express-async-handler');

// @desc    Get investor profile
// @route   GET /api/investor/profile
// @access  Private
const getInvestorProfile = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id })
    .populate('portfolio.startup')
    .populate('savedStartups')
    .populate('meetings.startup')
    .populate('documents.startup')
    .populate('notifications.startup')
    .populate('messages.startup');

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor);
});

// @desc    Update investor profile
// @route   PUT /api/investor/profile
// @access  Private
const updateInvestorProfile = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  const updatedInvestor = await Investor.findByIdAndUpdate(
    investor._id,
    req.body,
    { new: true }
  );

  res.json(updatedInvestor);
});

// @desc    Get recommended startups
// @route   GET /api/investor/recommendations
// @access  Private
const getRecommendedStartups = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  // Get startups that match investor preferences
  const recommendedStartups = await Startup.find({
    $and: [
      { industry: { $in: investor.industries } },
      { stage: { $in: investor.stages } },
      { fundingAsk: { $gte: investor.minTicket, $lte: investor.maxTicket } }
    ]
  }).limit(10);

  // Update stats
  investor.stats.startupsBrowsed += 1;
  await investor.save();

  res.json(recommendedStartups);
});

// @desc    Get meeting requests
// @route   GET /api/investor/meetings
// @access  Private
const getMeetingRequests = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id })
    .populate('meetings.startup');

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor.meetings);
});

// @desc    Update meeting status
// @route   PUT /api/investor/meetings/:meetingId
// @access  Private
const updateMeetingStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  const meeting = investor.meetings.id(req.params.meetingId);
  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  meeting.status = status;
  if (notes) meeting.notes = notes;
  await investor.save();

  res.json(meeting);
});

// @desc    Get saved startups
// @route   GET /api/investor/saved
// @access  Private
const getSavedStartups = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id })
    .populate('savedStartups');

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor.savedStartups);
});

// @desc    Save a startup
// @route   POST /api/investor/save/:startupId
// @access  Private
const saveStartup = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  if (!investor.savedStartups.includes(req.params.startupId)) {
    investor.savedStartups.push(req.params.startupId);
    await investor.save();
  }

  res.json({ message: 'Startup saved successfully' });
});

// @desc    Unsave a startup
// @route   DELETE /api/investor/unsave/:startupId
// @access  Private
const unsaveStartup = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  investor.savedStartups = investor.savedStartups.filter(
    id => id.toString() !== req.params.startupId
  );
  await investor.save();

  res.json({ message: 'Startup unsaved successfully' });
});

// @desc    Get portfolio
// @route   GET /api/investor/portfolio
// @access  Private
const getPortfolio = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id })
    .populate('portfolio.startup');

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor.portfolio);
});

// @desc    Get analytics
// @route   GET /api/investor/analytics
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  const analytics = {
    startupsBrowsed: investor.stats?.startupsBrowsed || 0,
    meetingsScheduled: investor.stats?.meetingsScheduled || 0,
    pitchDecksViewed: investor.stats?.pitchDecksViewed || 0,
    fundsCommitted: investor.portfolio.reduce((sum, item) => sum + item.amount, 0),
    portfolioSize: investor.portfolio.length,
    savedStartups: investor.savedStartups.length,
    activeMeetings: investor.meetings.filter(m => m.status === 'pending').length
  };

  res.json(analytics);
});

// @desc    Get documents
// @route   GET /api/investor/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id })
    .populate('documents.startup');

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor.documents);
});

// @desc    Add document
// @route   POST /api/investor/documents
// @access  Private
const addDocument = asyncHandler(async (req, res) => {
  const { type, title, url, startup } = req.body;
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  investor.documents.push({ type, title, url, startup });
  await investor.save();

  res.json({ message: 'Document added successfully' });
});

// @desc    Get notifications
// @route   GET /api/investor/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id })
    .populate('notifications.startup');

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor.notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/investor/notifications/:notificationId
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  const notification = investor.notifications.id(req.params.notificationId);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.read = true;
  await investor.save();

  res.json(notification);
});

// @desc    Get messages
// @route   GET /api/investor/messages
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id })
    .populate('messages.startup');

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor.messages);
});

// @desc    Send message
// @route   POST /api/investor/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { startup, content } = req.body;
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  investor.messages.push({ startup, content, sender: 'investor' });
  await investor.save();

  res.json({ message: 'Message sent successfully' });
});

// @desc    Get resources
// @route   GET /api/investor/resources
// @access  Private
const getResources = asyncHandler(async (req, res) => {
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  res.json(investor.resources);
});

// @desc    Add resource
// @route   POST /api/investor/resources
// @access  Private
const addResource = asyncHandler(async (req, res) => {
  const { type, title, url, description, category } = req.body;
  const investor = await Investor.findOne({ user: req.user._id });

  if (!investor) {
    res.status(404);
    throw new Error('Investor profile not found');
  }

  investor.resources.push({ type, title, url, description, category });
  await investor.save();

  res.json({ message: 'Resource added successfully' });
});

module.exports = {
  getInvestorProfile,
  updateInvestorProfile,
  getRecommendedStartups,
  getMeetingRequests,
  updateMeetingStatus,
  getSavedStartups,
  saveStartup,
  unsaveStartup,
  getPortfolio,
  getAnalytics,
  getDocuments,
  addDocument,
  getNotifications,
  markNotificationAsRead,
  getMessages,
  sendMessage,
  getResources,
  addResource
}; 