const mongoose = require('mongoose');

const tutorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subjects: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  hourlyRate: {
    type: Number,
    min: 0,
    default: 0
  },
  education: [{
    degree: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    year: {
      type: Number
    }
  }],
  experience: [{
    position: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    duration: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: {
      type: String
    },
    endTime: {
      type: String
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['certificate', 'degree', 'id', 'other']
    },
    url: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
tutorProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better query performance
tutorProfileSchema.index({ user: 1 });
tutorProfileSchema.index({ subjects: 1 });
tutorProfileSchema.index({ rating: -1 });
tutorProfileSchema.index({ isVerified: 1 });

const TutorProfile = mongoose.model('TutorProfile', tutorProfileSchema);

module.exports = TutorProfile; 