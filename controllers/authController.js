const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", username); // Debug log
  try {
    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("DETAILED LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // FIX: req.user is the ID itself, not an object containing an ID
    // Also use .select('+password') to ensure you can see the hash for comparison
    const user = await User.findById(req.user).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // 2. Hash the new password and save
    // (Mongoose will handle the hashing if you have a .pre('save') hook,
    // but doing it here manually is fine too since you're using .save())
    user.password = newPassword;

    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update Password Error:", err); // Log this so you see it in the terminal!
    res.status(500).json({ error: "Server error" });
  }
};
