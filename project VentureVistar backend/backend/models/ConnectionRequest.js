const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  investor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StartupProfile',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxLength: 1000
  },
  requestType: {
    type: String,
    enum: ['investment_interest', 'meeting_request', 'general_inquiry'],
    default: 'investment_interest'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'withdrawn'],
    default: 'pending'
  },
  investorProfile: {
    name: String,
    company: String,
    industries: [String],
    ticketSize: String,
    email: String
  },
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  meetingScheduled: {
    type: Boolean,
    default: false
  },
  meetingDetails: {
    scheduledAt: Date,
    platform: String,
    link: String,
    notes: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate requests
connectionRequestSchema.index({ investor: 1, startup: 1 }, { unique: true });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);