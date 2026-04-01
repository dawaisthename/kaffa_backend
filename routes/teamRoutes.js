const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} = require("../controllers/TeamController");
router.post("/", protect, upload.single("profileImage"), createMember);
router.get("/", getAllMembers);
router.get("/:id", getMemberById);
router.put("/:id", protect, upload.single("profileImage"), updateMember);
router.delete("/:id", protect, deleteMember);

module.exports = router;
