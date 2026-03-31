const express = require("express");
const router = express.Router();
const {
  getPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolioController");
const { protect } = require("../middleware/authMiddleware");

// Public Routes: Viewing the portfolio and filtering
// Example: /api/portfolio?sector=Logistics&region=East Africa
router.get("/", getPortfolio);
router.get("/:id", getPortfolioById);

// Protected Routes: Management (Admin only)
router.post("/", protect, createPortfolio);
router.put("/:id", protect, updatePortfolio);
router.delete("/:id", protect, deletePortfolio);

module.exports = router;
