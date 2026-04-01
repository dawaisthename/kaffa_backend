const express = require("express");
const router = express.Router();
const {
  login,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/login
router.post("/login", login);
// PUT /api/auth/update-password
router.put("/update-password", protect, updatePassword);
// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);
// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

module.exports = router;
