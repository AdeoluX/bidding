var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var itemSchema = new Schema({
  code: {
    type: String,
    default: function() {
      return 'itm_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    },
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    default: function() {
      return this.startingPrice;
    }
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'cancelled'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Virtual for bids on the item
itemSchema.virtual('bids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'item'
});

// Index for performance
itemSchema.index({ seller: 1, status: 1, endTime: 1, code: 1 });
itemSchema.index({ tags: 1 });
itemSchema.index({ currentPrice: 1 });
itemSchema.index({ version: 1 }); // Index for optimistic locking

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;