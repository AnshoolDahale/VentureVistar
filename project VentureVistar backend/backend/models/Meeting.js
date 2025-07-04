const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'pending' }, // confirmed, completed, etc.
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema); 