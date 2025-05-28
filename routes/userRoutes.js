const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET: Fetch user profile by email
router.get('/profile', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email query parameter is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      balance: user.balance,
      bonus: user.bonus,
      investments: user.investments,
      transactions: user.transactions,
    });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET: Fetch all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ✅ PUT: Update user balance
router.put('/:id/balance', async (req, res) => {
  const { id } = req.params;
  const { balance } = req.body;

  if (balance === undefined) {
    return res.status(400).json({ message: 'Balance is required in request body' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { balance },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Balance updated successfully',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        balance: updatedUser.balance,
        bonus: updatedUser.bonus,
      }
    });
  } catch (err) {
    console.error('Error updating balance:', err.message);
    res.status(500).json({ message: 'Failed to update balance', error: err.message });
  }
});

// ✅ PUT: Update user bonus
router.put('/:id/bonus', async (req, res) => {
  try {
    const { id } = req.params;
    const { bonus } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { bonus },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Bonus updated', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update bonus' });
  }
});

// ✅ PUT: Update a user's specific investment
router.put('/:userId/investments/:investmentId', async (req, res) => {
  const { userId, investmentId } = req.params;
  const { amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const investment = user.investments.id(investmentId);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });

    investment.amount = amount;
    await user.save();

    res.json({ message: 'Investment updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
