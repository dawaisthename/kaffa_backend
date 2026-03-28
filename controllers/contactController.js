const Contact = require("../models/Contact");

// Save message from public form
exports.createMessage = async (req, res) => {
  try {
    const newMessage = new Contact({
      fullName: req.body.fullName,
      email: req.body.email,
      company: req.body.company,
      inquiryType: req.body.inquiryType,
      message: req.body.message,
    });

    const savedMessage = await newMessage.save();
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
