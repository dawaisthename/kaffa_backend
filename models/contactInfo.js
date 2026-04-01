const mongoose = require("mongoose");

const contactInfo = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  addressLine: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String, // Kept as string to accommodate international formats
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
});

module.exports = mongoose.model("ContactInfo", contactInfo);
