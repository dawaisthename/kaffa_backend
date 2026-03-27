const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Investment", "Company News", "Insights", "Press"],
      default: "News",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tracks who posted it
  },
  { timestamps: true },
);

module.exports = mongoose.model("News", newsSchema);
