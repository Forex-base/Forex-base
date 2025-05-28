const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  type: { type: String }, // 'deposit', 'withdrawal', 'investment'
  method: { type: String }, // Optional: e.g., 'bank', 'crypto', etc.
  amount: Number,
  status: { type: String, default: 'completed' }, // 'pending', 'completed', 'rejected'
  details: String,
  timestamp: { type: Date, default: Date.now }
});

const investmentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  plan: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  subscribed: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  transactions: [transactionSchema],
  investments: [investmentSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
