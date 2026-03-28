const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true }, // "Position of Interest" from your form
  coverLetter: { type: String },
  resumePath: { type: String, required: true }, // URL or path to the stored PDF/DOCX
  status: { type: String, default: "Pending" },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", ApplicationSchema);
