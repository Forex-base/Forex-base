const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ GET user profile including transactions
router.get('/profile', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });

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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ PUT update balance
router.put('/:id/balance', async (req, res) => {
  const { balance } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { balance },
      { new: true }
    );
    res.json({ message: 'Balance updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating balance', error: err.message });
  }
});

// ✅ PUT update bonus
router.put('/:id/bonus', async (req, res) => {
  const { bonus } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bonus },
      { new: true }
    );
    res.json({ message: 'Bonus updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error updating bonus', error: err.message });
  }
});

// ✅ PUT update investment
router.put('/:userId/investments/:investmentId', async (req, res) => {
  const { userId, investmentId } = req.params;
  const { amount } = req.body;
  try {
    const user = await User.findById(userId);
    const investment = user?.investments?.id(investmentId);
    if (!investment) return res.status(404).json({ message: 'Investment not found' });

    investment.amount = amount;
    await user.save();
    res.json({ message: 'Investment updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating investment', error: err.message });
  }
});

// ✅ GET: All transactions for a user by ID
router.get('/:id/transactions', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ transactions: user.transactions });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ POST add transaction (used by frontend for deposit/withdraw/invest)
router.post('/:id/transactions', async (req, res) => {
  const { type, amount, description } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newTransaction = {
      type,
      amount,
      description,
      date: new Date()
    };

    user.transactions.push(newTransaction);
    await user.save();

    res.json({ message: 'Transaction recorded', transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ message: 'Error saving transaction', error: err.message });
  }
});

// ✅ GET all users + transactions (for admin)
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find({}, 'fullName email balance bonus transactions');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

module.exports = router;
