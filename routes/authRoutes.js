const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, username, password, phone, subscribe } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const isSubscribed = subscribe === true || subscribe === 'yes' || subscribe === 'on';

    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPassword,
      phone, // ✅ save as `phone`, not `phoneNumber`
      subscribed: isSubscribed
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        phone: user.phone, // ✅ return as `phone` for frontend
        subscribed: user.subscribed,
        balance: user.balance,
        bonus: user.bonus,
        transactions: user.transactions,
        investments: user.investments
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// GET /api/auth/all — Admin: Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Fetching all users failed:', err);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
});

// PUT /api/users/:id/balance — Admin: Update balance
router.put('/users/:id/balance', async (req, res) => {
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
