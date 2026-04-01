const Application = require("../models/Application");
const fs = require("fs"); // Import the file system module
const sendEmail = require("../utils/sendEmail");

const getApplicationRecipientEmail = () =>
  process.env.CONTACT_EMAIL_CAREERS || process.env.CONTACT_EMAIL_GENERAL;
// Submit application
exports.createApplication = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Resume is required" });
  }
  try {
    const newApplication = new Application({
      fullName: req.body.fullName,
      email: req.body.email,
      position: req.body.position,
      coverLetter: req.body.coverLetter || req.body.message,
      resumePath: req.file.path,
    });

    const saved = await newApplication.save();

    // --- EMAIL NOTIFICATION LOGIC ---
    const recipientEmail = getApplicationRecipientEmail();
    if (!recipientEmail) {
      return res.status(500).json({
        error: "Application email destination is not configured",
      });
    }

    try {
      const info = await sendEmail({
        to: recipientEmail,
        subject: `New Job Application: ${req.body.position} - ${req.body.fullName}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #0a1622;">
            <h2 style="color: #c5a35d;">New Application Received</h2>
            <p><strong>Applicant:</strong> ${req.body.fullName}</p>
            <p><strong>Email:</strong> ${req.body.email}</p>
            <p><strong>Position:</strong> ${req.body.position}</p>
            <p><strong>Message:</strong><br/>${req.body.coverLetter || req.body.message || "No message provided."}</p>
            <hr/>
            <p style="font-size: 12px; color: #888;">This application has been saved to the Admin Dashboard.</p>
          </div>
        `,
        replyTo: req.body.email,
        attachments: [
          {
            filename: req.file.originalname,
            path: req.file.path, // Sends the actual file to the HR email
          },
        ],
      });
      console.log("Application mail delivery:", {
        to: recipientEmail,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
    } catch (mailErr) {
      console.error(
        "Email failed to send, but application was saved:",
        mailErr,
      );
    }
    // --------------------------------

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
