const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    // If req.user is only an ID (from token), fetch the full user
    const userId = req.user?._id || req.user;
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      balance: user.balance || 0,
      bonus: user.bonus || 0,
      investments: user.investments || [],
      transactions: user.transactions || []
    });
  } catch (err) {
    console.error('Error in getProfile:', err);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};
