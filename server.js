const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // 1. Added Mongoose
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const jobRoutes = require("./routes/jobRoutes");
const contactRoutes = require("./routes/contactRoutes");
const ApplicationsRoutes = require("./routes/applicationsRoutes"); // Import job routes
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Database Connection Logic
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// --- ADD THIS LINE ---
app.use("/uploads", express.static("uploads"));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/careers", jobRoutes); // Added this line to include job routes
app.use("/api/contacts", contactRoutes);
app.use("/api/applications", ApplicationsRoutes); // Added this line to include application routes
// Base Route for testing
app.get("/", (req, res) => {
  res.send("Kaffa API is live...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
