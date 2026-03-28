const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail"); // Added this import

// Save message from public form
exports.createMessage = async (req, res) => {
  try {
    const { fullName, email, company, inquiryType, message } = req.body;

    const newMessage = new Contact({
      fullName,
      email,
      company,
      inquiryType,
      message,
    });

    const savedMessage = await newMessage.save();

    // --- DYNAMIC EMAIL ROUTING LOGIC ---
    let recipientEmail = "info@kaffa-holding.com"; // Default

    // Logic to route based on inquiry type
    if (inquiryType && inquiryType.toLowerCase().includes("investment")) {
      recipientEmail = "investments@kaffa-holding.com";
    } else if (inquiryType && inquiryType.toLowerCase().includes("career")) {
      recipientEmail = "career@kaffa-holding.com";
    }

    try {
      await sendEmail({
        to: recipientEmail,
        subject: `New ${inquiryType} Inquiry: ${fullName}`,
        html: `
          <div style="font-family: 'Helvetica', sans-serif; color: #0a1622; line-height: 1.6;">
            <div style="background-color: #0a1622; padding: 20px; text-align: center;">
              <h1 style="color: #c5a35d; margin: 0; font-size: 20px; letter-spacing: 2px;">KAFFA HOLDINGS</h1>
            </div>
            <div style="padding: 30px; border: 1px solid #eee;">
              <h2 style="border-bottom: 2px solid #fcf8ef; padding-bottom: 10px;">New Contact Inquiry</h2>
              <p><strong>From:</strong> ${fullName} (${email})</p>
              <p><strong>Company:</strong> ${company || "Not Specified"}</p>
              <p><strong>Type:</strong> ${inquiryType}</p>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <strong>Message:</strong><br/>
                ${message}
              </div>
            </div>
            <p style="font-size: 11px; color: #999; text-align: center; margin-top: 20px;">
              This inquiry was sent via the Kaffa Investment Holdings website contact form.
            </p>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("Database saved, but notification email failed:", mailErr);
    }
    // ------------------------------------

    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
};

// Fetch all messages for admin inbox
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Delete a specific message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
