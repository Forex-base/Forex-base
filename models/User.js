const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['deposit', 'withdrawal', 'investment'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  date: { type: Date, default: Date.now }
});

const investmentSchema = new mongoose.Schema({
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  subscribed: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  transactions: [transactionSchema],
  investments: [investmentSchema],
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
