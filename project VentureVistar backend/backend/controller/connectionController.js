const ConnectionRequest = require('../models/ConnectionRequest');
const StartupProfile = require('../models/StartupProfile');
const Investor = require('../models/investorModel');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Send connection request from investor to startup
// @route   POST /api/connections/request
// @access  Private (Investor)
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const { startupId, message, requestType, investorProfile } = req.body;

  // Validate startup exists
  const startup = await StartupProfile.findById(startupId);
  if (!startup) {
    res.status(404);
    throw new Error('Startup not found');
  }

  // Check if request already exists
  const existingRequest = await ConnectionRequest.findOne({
    investor: req.user._id,
    startup: startupId
  });

  if (existingRequest) {
    res.status(400);
    throw new Error('Connection request already sent to this startup');
  }

  // Create connection request
  const connectionRequest = await ConnectionRequest.create({
    investor: req.user._id,
    startup: startupId,
    message: message || `Hi! I'm interested in learning more about your startup and potential investment opportunities.`,
    requestType: requestType || 'investment_interest',
    investorProfile: {
      name: investorProfile?.name || req.user.name,
      company: investorProfile?.company || 'Independent Investor',
      industries: investorProfile?.industries || [],
      ticketSize: investorProfile?.ticketSize || 'Not specified',
      email: req.user.email
    }
  });

  // Populate the request with startup and investor details
  const populatedRequest = await ConnectionRequest.findById(connectionRequest._id)
    .populate('startup', 'name email industry')
    .populate('investor', 'name email');

  // TODO: Send notification/email to startup
  // This could be implemented with email service or push notifications

  res.status(201).json({
    success: true,
    message: 'Connection request sent successfully',
    connectionRequest: populatedRequest
  });
});

// @desc    Get all startups available for connection
// @route   GET /api/startups/available
// @access  Private (Investor)
const getAvailableStartups = asyncHandler(async (req, res) => {
  // Get all startups that are active and looking for funding
  const startups = await StartupProfile.find({
    isActive: { $ne: false },
    fundingStatus: { $in: ['fundraising', 'seeking_investors', 'open'] }
  }).select('name tagline industry location fundingAsk stage description team traction logo');

  // Get investor's existing connection requests to filter out
  const existingRequests = await ConnectionRequest.find({
    investor: req.user._id
  }).select('startup');

  const requestedStartupIds = existingRequests.map(req => req.startup.toString());

  // Filter out startups already requested
  const availableStartups = startups.filter(startup => 
    !requestedStartupIds.includes(startup._id.toString())
  );

  res.json(availableStartups);
});

// @desc    Get investor's connection requests
// @route   GET /api/connections/my-requests
// @access  Private (Investor)
const getMyConnectionRequests = asyncHandler(async (req, res) => {
  const requests = await ConnectionRequest.find({ investor: req.user._id })
    .populate('startup', 'name industry location logo')
    .sort({ createdAt: -1 });

  res.json(requests);
});

// @desc    Get connection requests for startup
// @route   GET /api/connections/startup-requests
// @access  Private (Startup)
const getStartupConnectionRequests = asyncHandler(async (req, res) => {
  // Find startup profile for the current user
  const startupProfile = await StartupProfile.findOne({ user: req.user._id });
  
  if (!startupProfile) {
    res.status(404);
    throw new Error('Startup profile not found');
  }

  const requests = await ConnectionRequest.find({ startup: startupProfile._id })
    .populate('investor', 'name email')
    .sort({ createdAt: -1 });

  res.json(requests);
});

// @desc    Respond to connection request
// @route   PUT /api/connections/respond/:requestId
// @access  Private (Startup)
const respondToConnectionRequest = asyncHandler(async (req, res) => {
  const { status, message, meetingDetails } = req.body;
  
  const connectionRequest = await ConnectionRequest.findById(req.params.requestId)
    .populate('startup')
    .populate('investor', 'name email');

  if (!connectionRequest) {
    res.status(404);
    throw new Error('Connection request not found');
  }

  // Verify the startup owns this request
  const startupProfile = await StartupProfile.findOne({ user: req.user._id });
  if (!startupProfile || connectionRequest.startup._id.toString() !== startupProfile._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to respond to this request');
  }

  // Update the connection request
  connectionRequest.status = status;
  connectionRequest.response = {
    message: message || (status === 'accepted' ? 'Request accepted!' : 'Request declined'),
    respondedAt: new Date(),
    respondedBy: req.user._id
  };

  if (status === 'accepted' && meetingDetails) {
    connectionRequest.meetingScheduled = true;
    connectionRequest.meetingDetails = meetingDetails;
  }

  await connectionRequest.save();

  // TODO: Send notification to investor about the response

  res.json({
    success: true,
    message: `Connection request ${status} successfully`,
    connectionRequest
  });
});

// @desc    Withdraw connection request
// @route   DELETE /api/connections/withdraw/:requestId
// @access  Private (Investor)
const withdrawConnectionRequest = asyncHandler(async (req, res) => {
  const connectionRequest = await ConnectionRequest.findById(req.params.requestId);

  if (!connectionRequest) {
    res.status(404);
    throw new Error('Connection request not found');
  }

  // Verify the investor owns this request
  if (connectionRequest.investor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to withdraw this request');
  }

  // Update status to withdrawn instead of deleting
  connectionRequest.status = 'withdrawn';
  await connectionRequest.save();

  res.json({
    success: true,
    message: 'Connection request withdrawn successfully'
  });
});

module.exports = {
  sendConnectionRequest,
  getAvailableStartups,
  getMyConnectionRequests,
  getStartupConnectionRequests,
  respondToConnectionRequest,
  withdrawConnectionRequest
};