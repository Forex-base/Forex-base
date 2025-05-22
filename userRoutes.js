const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET user profile
router.get('/profile', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT: update user balance
router.put('/:id/balance', async (req, res) => {
  try {
    const { id } = req.params;
    const { balance } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { balance },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Balance updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update balance' });
  }
});

module.exports = router;
