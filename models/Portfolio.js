const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Matches the 'Sector' filter (Real Estate, Technology, etc.)
  sector: {
    type: String,
    required: true,
    enum: [
      "Real Estate",
      "Technology",
      "Logistics",
      "Agriculture",
      "Financial Services",
      "Energy",
    ],
  },
  // Matches the 'Region' filter (East Africa, Middle East, etc.)
  region: {
    type: String,
    required: true,
    enum: ["East Africa", "Middle East", "Southeast Asia"],
  },

  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexing for faster filtering by sector and region
PortfolioSchema.index({ sector: 1, region: 1 });

module.exports = mongoose.model("Portfolio", PortfolioSchema);
