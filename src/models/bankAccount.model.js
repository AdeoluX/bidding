var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto'); // Assuming you're using Node's built-in crypto module

var bankAccountSchema = new Schema({
  code: {
    type: String, // You can also use Schema.Types.String if UUIDs are stored as strings
    default: function() {
      return 'bac_' + crypto.randomUUID().split('-').join('').slice(0,12); // Replaced arrow function with a regular function
    }
  },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
  provider: { type: String, enum: ['paystack', 'flutterwave'], default: 'paystack' },
  subAccountCode: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // or false depending on your schema needs
  },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('BankAccount', bankAccountSchema);
