var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var userSchema = new Schema({
  code: {
    type: String,
    default: function() {
      return 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    },
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  address: {
    type: String,
    default: null
  },
  tin: {
    type: String,
    default: null
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpiry: {
    type: Date,
    default: null
  },
  isTinVerified: {
    type: Boolean,
    default: false
  },
  tinVerificationDate: {
    type: Date,
    default: null
  },
  tinVerificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  tinVerificationNote: {
    type: String,
    default: null
  },
  isEligible: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.emailVerificationToken;
      delete ret.resetToken;
      return ret;
    }
  }
});

// Virtual for bids placed by the user
userSchema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'bidder'
});

// Method to check if user is eligible to bid
userSchema.methods.canBid = function() {
  return this.isEmailVerified && this.isTinVerified && this.isEligible;
};

// Index for performance
userSchema.index({ email: 1, code: 1 });
userSchema.index({ tin: 1 });
userSchema.index({ isTinVerified: 1, isEligible: 1 });

var User = mongoose.model('User', userSchema);

module.exports = User;