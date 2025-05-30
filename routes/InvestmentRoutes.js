const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Transaction = require("../models/Transaction");

// Add a new investment
router.post("/", async (req, res) => {
  const { email, plan, profitPercent, durationHours } = req.body;

  if (!email || !plan || !profitPercent || !durationHours) {
    return res.status(400).json({ message: "Missing investment details" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const investment = {
      planName: plan,
      profitPercent,
      durationHours,
      startTime: new Date(),
      status: "active",
    };

    user.investments = user.investments || [];
    user.investments.push(investment);
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      type: "investment",
      amount: 0,
      status: "completed",
      details: `Invested in ${plan} plan (${profitPercent}% for ${durationHours}h)`,
      date: new Date(),
    });

    await transaction.save();

    res.status(200).json({
      message: `Investment in ${plan} started successfully.`,
      investment,
    });
  } catch (err) {
    console.error("Investment error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
