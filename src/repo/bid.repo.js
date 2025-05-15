const BaseRepository = require('./base.repo');
const Bid = require('../models/bid.model');

class BidRepository extends BaseRepository {
  constructor() {
    super(Bid);
  }

  // Custom methods specific to Bid model
  async findByCode(code) {
    return this.findOne({ query: { code } });
  }

  async findBidsByItem(itemId) {
    return this.findAll({
      query: { item: itemId },
      sort: { amount: -1, createdAt: -1 },
      populate: {
        path: 'bidder',
        select: 'firstname lastname email'
      }
    });
  }

  async findBidsByBidder(bidderId) {
    return this.findAll({
      query: { bidder: bidderId },
      sort: { createdAt: -1 },
      populate: {
        path: 'item',
        select: 'title description currentPrice status'
      }
    });
  }

  async findHighestBid(itemId) {
    return this.findOne({
      query: { item: itemId },
      sort: { amount: -1 },
      populate: {
        path: 'bidder',
        select: 'firstname lastname email'
      }
    });
  }

  async findBidsByItemAndBidder(itemId, bidderId) {
    return this.findAll({
      query: { item: itemId, bidder: bidderId },
      sort: { createdAt: -1 }
    });
  }
}

module.exports = new BidRepository(); 