const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { updatePassword } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/login
router.post("/login", login);
// PUT /api/auth/update-password
router.put("/update-password", protect, updatePassword);

module.exports = router;
