const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
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
} = require('../controller/investorController');

// Profile routes
router.get('/profile', requireAuth, getInvestorProfile);
router.put('/profile', requireAuth, updateInvestorProfile);

// Startup recommendations and interactions
router.get('/recommendations', requireAuth, getRecommendedStartups);
router.get('/saved', requireAuth, getSavedStartups);
router.post('/save/:startupId', requireAuth, saveStartup);
router.delete('/unsave/:startupId', requireAuth, unsaveStartup);

// Meetings
router.get('/meetings', requireAuth, getMeetingRequests);
router.put('/meetings/:meetingId', requireAuth, updateMeetingStatus);

// Portfolio and analytics
router.get('/portfolio', requireAuth, getPortfolio);
router.get('/analytics', requireAuth, getAnalytics);

// Documents
router.get('/documents', requireAuth, getDocuments);
router.post('/documents', requireAuth, addDocument);

// Notifications
router.get('/notifications', requireAuth, getNotifications);
router.put('/notifications/:notificationId', requireAuth, markNotificationAsRead);

// Messages
router.get('/messages', requireAuth, getMessages);
router.post('/messages', requireAuth, sendMessage);

// Resources
router.get('/resources', requireAuth, getResources);
router.post('/resources', requireAuth, addResource);

module.exports = router; 