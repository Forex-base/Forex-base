const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

router.post('/withdraw', async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid userId or amount' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.balance -= amount;
    await user.save();

    await Transaction.create({
      userId: user._id,
      type: 'withdrawal',
      amount,
      status: 'completed',
      details: 'User requested withdrawal'
    });

    res.status(200).json({ message: 'Withdrawal successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Withdrawal failed', error: err.message });
  }
});

module.exports = router;
