const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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

exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username }).select(
      "+resetPasswordToken +resetPasswordExpires",
    );

    // Avoid username enumeration by returning success even if user is missing.
    if (!user) {
      return res.status(200).json({
        message: "If the account exists, a reset email has been sent.",
      });
    }

    const recoveryEmail = process.env.ADMIN_RECOVERY_EMAIL;
    if (!recoveryEmail) {
      return res
        .status(500)
        .json({ message: "Recovery email is not configured" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetBaseUrl =
      process.env.ADMIN_RESET_BASE_URL || "http://localhost:5173/admin-portal-kaffa";
    const resetUrl = `${resetBaseUrl}?resetToken=${resetToken}&username=${encodeURIComponent(username)}`;

    await sendEmail({
      to: recoveryEmail,
      subject: "Kaffa Admin Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0a1622;">
          <h2 style="color: #c5a35d;">Admin password reset request</h2>
          <p>A request to reset the admin password was received for user <strong>${username}</strong>.</p>
          <p>This link is valid for 15 minutes:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p style="font-size: 12px; color: #777;">If you did not request this, you can ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      message: "If the account exists, a reset email has been sent.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Failed to process reset request" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { username, token, newPassword } = req.body;
    if (!username || !token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Username, token and new password are required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      username,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires +password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Failed to reset password" });
  }
};
