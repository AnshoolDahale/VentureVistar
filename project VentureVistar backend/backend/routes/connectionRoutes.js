const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  sendConnectionRequest,
  getAvailableStartups,
  getMyConnectionRequests,
  getStartupConnectionRequests,
  respondToConnectionRequest,
  withdrawConnectionRequest
} = require('../controller/connectionController');

// Investor routes
router.post('/request', requireAuth, sendConnectionRequest);
router.get('/my-requests', requireAuth, getMyConnectionRequests);
router.delete('/withdraw/:requestId', requireAuth, withdrawConnectionRequest);

// Startup routes
router.get('/startup-requests', requireAuth, getStartupConnectionRequests);
router.put('/respond/:requestId', requireAuth, respondToConnectionRequest);

// Public routes (with auth)
router.get('/available-startups', requireAuth, getAvailableStartups);

module.exports = router;