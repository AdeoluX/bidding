const BaseRepository = require('./base.repo');
const User = require('../models/user.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  // Custom methods specific to User model
  async findByEmail(email) {
    return this.findOne({ query: { email } });
  }

  async findByCode(code) {
    return this.findOne({ query: { code } });
  }

  async updateBalance(userId, amount) {
    return this.update(userId, { $inc: { balance: amount } });
  }

  async findWithBids(userId) {
    return this.findOne({
      query: { _id: userId },
      populate: {
        path: 'bids',
        populate: {
          path: 'item'
        }
      }
    });
  }
}

module.exports = new UserRepository(); 