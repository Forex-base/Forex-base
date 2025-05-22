const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  subscribed: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

