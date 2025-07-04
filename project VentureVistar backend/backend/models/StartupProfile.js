const mongoose = require('mongoose');

const startupProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logo: { type: String, default: '' },
  tagline: { type: String, default: '' },
  industry: { type: String, default: '' },
  stage: { type: String, default: '' },
  team: [{ type: String }],
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
}, {
  timestamps: true
});

module.exports = mongoose.model('StartupProfile', startupProfileSchema); 