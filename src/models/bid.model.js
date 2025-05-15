var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var bidSchema = new Schema({
  code: {
    type: String,
    default: function() {
      return 'bid_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    },
    unique: true
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  bidder: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Index for performance
bidSchema.index({ item: 1, bidder: 1, createdAt: -1, code: 1 });

var Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;