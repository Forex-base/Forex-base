// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// GET user profile by email
router.get('/profile', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email query parameter is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

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

// GET all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// PUT update user balance
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
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

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
    res.status(500).json({ message: 'Failed to update balance', error: err.message });
  }
});

// PUT update user bonus
router.put('/:id/bonus', async (req, res) => {
  const { id } = req.params;
  const { bonus } = req.body;

  if (bonus === undefined) {
    return res.status(400).json({ message: 'Bonus is required in request body' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { bonus },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'Bonus updated successfully',
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        bonus: updatedUser.bonus,
        balance: updatedUser.balance,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bonus', error: err.message });
  }
});

// PUT reset password
router.put('/:id/password', async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) return res.status(400).json({ message: 'New password is required' });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(id, { password: hashedPassword });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error resetting password:', err.message);
    res.status(500).json({ message: 'Failed to reset password', error: err.message });
  }
});

// PUT update investments (optional route if admin needs to edit investments manually)
router.put('/:id/investments', async (req, res) => {
  const { id } = req.params;
  const { investments } = req.body;

  if (!Array.isArray(investments)) {
    return res.status(400).json({ message: 'Investments should be an array' });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { investments }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      message: 'Investments updated successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update investments', error: err.message });
  }
});

module.exports = router;
