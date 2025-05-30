const express = require('express'); 
const router = express.Router();
const User = require('../models/User');

// POST a transaction (deposit, withdraw, or investment)
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

    const validTypes = ['deposit', 'withdraw', 'investment'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    let transactionStatus = 'completed';

    if (type === 'deposit') {
      user.balance += numericAmount;
    } else if (type === 'withdraw') {
      if (user.balance < numericAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      user.balance -= numericAmount;
    } else if (type === 'investment') {
      transactionStatus = 'pending'; // Admin needs to approve
      user.investments.push({
        amount: numericAmount,
        plan: method,
        status: 'pending',
        timestamp: new Date()
      });
    }

    // Add transaction log
    user.transactions.push({
      type,
      method,
      amount: numericAmount,
      status: transactionStatus,
      details: method,
      timestamp: new Date()
    });

    await user.save();

    console.log(`${type} of $${numericAmount} via ${method} by ${email}`);
    return res.status(200).json({ message: `${type} processed successfully`, balance: user.balance });
  } catch (err) {
    console.error('Transaction error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET all transactions (admin use)
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    const allTransactions = users.flatMap(user =>
      user.transactions.map(tx => ({
        ...tx.toObject(),
        userEmail: user.email,
        userId: user._id
      }))
    );
    res.json(allTransactions);
  } catch (err) {
    console.error('Error fetching all transactions:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET user transaction & investment history
router.get('/history/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const combined = [
      ...user.transactions.map(tx => ({
        type: tx.type,
        amount: tx.amount,
        method: tx.method,
        details: tx.details || '—',
        status: tx.status || 'completed',
        timestamp: tx.timestamp
      })),
      ...user.investments.map(inv => ({
        type: 'investment',
        amount: inv.amount,
        details: `Plan: ${inv.plan}`,
        status: inv.status || 'pending',
        timestamp: inv.timestamp
      }))
    ];

    combined.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(combined);
  } catch (err) {
    console.error('Error fetching user transactions:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
