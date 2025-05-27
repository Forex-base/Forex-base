const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/transaction');

// Create a new transaction
router.post('/', async (req, res) => {
  const { email, type, method, amount, details = "" } = req.body;

  if (!email || !type || !method || !amount) {
    return res.status(400).json({ message: 'Missing transaction details' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
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

    const transaction = new Transaction({
      userId: user._id,
      type: type.charAt(0).toUpperCase() + type.slice(1),
      amount: numericAmount,
      status: 'Completed',
      details: `${method} - ${details}`,
      timestamp: new Date()
    });

    await transaction.save();

    console.log(`${type} of $${numericAmount} via ${method} from ${email}`);

    return res.status(200).json({ 
      message: `${type} request processed successfully.`,
      balance: user.balance,
      transaction
    });

  } catch (err) {
    console.error('Transaction error:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction history using email
router.get('/history/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transactions = await Transaction.find({ userId: user._id }).sort({ timestamp: -1 });
    return res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: View all transactions
router.get('/admin/all', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    return res.status(200).json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Edit transaction
router.put('/admin/edit/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const { status, amount, details } = req.body;

  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (status) transaction.status = status;
    if (amount) transaction.amount = amount;
    if (details) transaction.details = details;

    await transaction.save();

    return res.status(200).json({ message: 'Transaction updated successfully', transaction });
  } catch (err) {
    console.error('Error updating transaction:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
