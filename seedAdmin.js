require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Check if admin already exists
    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
      console.log("Admin user already exists. Skipping seed.");
      process.exit();
    }

    // Create new admin
    const admin = new User({
      username: "admin",
      password: "your_secure_password", // The Model's .pre('save') hook will hash this!
    });

    await admin.save();
    console.log("Admin user created successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
