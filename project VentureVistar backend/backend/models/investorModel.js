const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  industries: [{
    type: String
  }],
  stages: [{
    type: String,
    enum: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+']
  }],
  minTicket: {
    type: Number,
    required: true
  },
  maxTicket: {
    type: Number,
    required: true
  },
  portfolio: [{
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    amount: Number,
    date: Date,
    equity: Number,
    valuation: Number
  }],
  linkedin: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  savedStartups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup'
  }],
  preferences: {
    location: [String],
    teamSize: {
      min: Number,
      max: Number
    },
    traction: {
      minRevenue: Number,
      minUsers: Number
    }
  },
  meetings: [{
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    date: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending'
    },
    notes: String,
    type: {
      type: String,
      enum: ['pitch', 'due_diligence', 'negotiation', 'other']
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['pitch_deck', 'term_sheet', 'nda', 'cap_table', 'other']
    },
    title: String,
    url: String,
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  stats: {
    startupsBrowsed: {
      type: Number,
      default: 0
    },
    meetingsScheduled: {
      type: Number,
      default: 0
    },
    pitchDecksViewed: {
      type: Number,
      default: 0
    },
    fundsCommitted: {
      type: Number,
      default: 0
    }
  },
  searchHistory: [{
    query: String,
    filters: {
      industries: [String],
      stages: [String],
      minTicket: Number,
      maxTicket: Number,
      locations: [String]
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['meeting_request', 'pitch_deck', 'message', 'update']
    },
    message: String,
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  messages: [{
    startup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Startup'
    },
    content: String,
    sender: {
      type: String,
      enum: ['investor', 'startup']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  resources: [{
    type: {
      type: String,
      enum: ['article', 'video', 'guide', 'template']
    },
    title: String,
    url: String,
    description: String,
    category: String,
    savedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Investor', investorSchema); 