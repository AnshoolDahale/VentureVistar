const mongoose = require('mongoose');

const fundraisingCampaignSchema = new mongoose.Schema({
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  round: { type: String, required: true }, // Seed, Series A, etc.
  amountSought: { type: Number, required: true },
  amountRaised: { type: Number, default: 0 },
  pitchDeck: String, // file URL
  businessModelCanvas: String, // file URL
  status: { type: String, default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('FundraisingCampaign', fundraisingCampaignSchema); 