const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    yearsExperience: {
      type: Number,
      min: 0,
    },
    biography: {
      type: String,
      maxlength: 1000,
    },
    profileImageUrl: {
      type: String,
    },
    // Useful for categorizing or filtering
    department: {
      type: String,
      default: "General",
    },
    // Helps with soft-deletes or hiding profiles without deleting
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
module.exports = TeamMember;
