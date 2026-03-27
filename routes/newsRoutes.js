const express = require("express");
const router = express.Router();
const {
  getNews,
  createNews,
  deleteNews,
  getNewsById,
  updateNews,
} = require("../controllers/newsController");
const { protect } = require("../middleware/authMiddleware");

// Public can view news
router.get("/", getNews);

// Only Admin can create or delete
router.post("/", protect, createNews);
router.get("/:id", getNewsById);
// Add this line to your existing routes
router.put("/:id", protect, updateNews);
router.delete("/:id", protect, deleteNews);

module.exports = router;
