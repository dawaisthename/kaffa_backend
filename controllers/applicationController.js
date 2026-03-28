const Application = require("../models/Application");
const fs = require("fs"); // Import the file system module

// Submit application
exports.createApplication = async (req, res) => {
  try {
    const newApplication = new Application({
      fullName: req.body.fullName,
      email: req.body.email,
      position: req.body.position,
      coverLetter: req.body.coverLetter,
      resumePath: req.file.path, // Path to the uploaded file
    });

    const saved = await newApplication.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Application submission failed" });
  }
};

// Get all applications
exports.getApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ appliedAt: -1 });
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Delete application and associated resume file
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the application first to get the file path
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // 2. Delete the physical file from the server
    if (application.resumePath) {
      fs.unlink(application.resumePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    // 3. Delete the record from the database
    await Application.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Application and file deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete application" });
  }
};
