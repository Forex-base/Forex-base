const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { email, type, method, amount } = req.body;

  if (!email || !type || !method || !amount) {
    return res.status(400).json({ message: 'Missing transaction details' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (type === 'deposit') {
      user.balance += numericAmount;
    } else if (type === 'withdraw') {
      if (user.balance < numericAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      user.balance -= numericAmount;
    } else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    await user.save();

    console.log(`${type} of $${numericAmount} via ${method} from ${email}`);
    return res.status(200).json({ message: `${type} request processed successfully.`, balance: user.balance });
  } catch (err) {
    console.error('Transaction error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
