const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String }, // New field from design
  inquiryType: { type: String, default: "General Inquiry" }, // New field from design
  message: { type: String, required: true },
  status: { type: String, default: "New" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Contact", ContactSchema);
