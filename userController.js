// controllers/userController.js

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      name: user.name,
      email: user.email,
      balance: user.balance,
      bonus: user.bonus,
      investments: user.investments,
      transactions: user.transactions
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};
