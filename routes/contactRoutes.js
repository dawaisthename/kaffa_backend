const router = require("express").Router();
const contactController = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

// POST: Save message from public form
router.post("/", contactController.createMessage);

// GET: Admin inbox fetch
router.get("/", protect, contactController.getMessages);
router.delete("/:id", protect, contactController.deleteMessage);
module.exports = router;
