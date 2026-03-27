const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true }, // e.g., "Kaffa Technologies"
  location: { type: String, required: true },   // e.g., "Addis Ababa, Ethiopia"
  jobType: { type: String, default: "Full-time" }, // e.g., "Remote", "Contract"
  content: { type: String, required: true },    // For the job description
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);