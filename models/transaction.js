const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // Deposit, Withdrawal, Investment
  amount: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // Pending, Completed, Rejected
  details: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
