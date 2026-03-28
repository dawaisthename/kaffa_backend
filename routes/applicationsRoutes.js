const router = require("express").Router();

const {
  createApplication,
  getApplications,
  deleteApplication,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Routes
router.post("/", upload.single("resume"), createApplication);

// Admin routes
router.get("/", protect, getApplications);
router.delete("/:id", protect, deleteApplication);

module.exports = router;
