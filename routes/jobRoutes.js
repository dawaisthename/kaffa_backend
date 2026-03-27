const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  deleteJob,
  updateJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

// Public can view jobs
router.get("/", getJobs);
router.get("/:id", getJobById);
// Only Admin can create or delete
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;
