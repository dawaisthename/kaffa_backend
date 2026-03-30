require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
      console.log("Admin user already exists. Skipping seed.");
      return; // Don't exit here
    }

    const admin = new User({
      username: "admin",
      password: "your_secure_password",
    });

    await admin.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

// Export the function without immediately calling it
module.exports = seedAdmin;
