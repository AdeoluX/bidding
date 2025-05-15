const BaseRepository = require('./base.repo');
const Item = require('../models/item.model');

class ItemRepository extends BaseRepository {
  constructor() {
    super(Item);
  }

  // Custom methods specific to Item model
  async findByCode(code) {
    return this.findOne({ query: { code } });
  }

  async findActiveItems() {
    return this.findAll({
      query: { status: 'active', endTime: { $gt: new Date() } },
      sort: { endTime: 1 }
    });
  }

  async findItemsBySeller(sellerId) {
    return this.findAll({
      query: { seller: sellerId },
      sort: { createdAt: -1 }
    });
  }

  async findWithBids(itemId) {
    return this.findOne({
      query: { _id: itemId },
      populate: {
        path: 'bids',
        populate: {
          path: 'bidder',
          select: 'firstname lastname email'
        }
      }
    });
  }

  async updateCurrentPrice(itemId, newPrice) {
    return this.update(itemId, { currentPrice: newPrice });
  }

  async updateStatus(itemId, status) {
    return this.update(itemId, { status });
  }
}

module.exports = new ItemRepository(); 