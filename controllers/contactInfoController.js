const ContactInfo = require("../models/contactInfo");

// 1. Create a new office contact
exports.createContact = async (req, res) => {
  try {
    const newContact = new ContactInfo(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating contact", error: error.message });
  }
};

// 2. Get all office contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactInfo.find();
    res.status(200).json(contacts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching contacts", error: error.message });
  }
};
exports.FooterContact = async (req, res) => {
  console.log("Fetching footer contact information...");
  try {
    const contacts = await ContactInfo.find({ country: "Ethiopia" });
    res.status(200).json(contacts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching contacts", error: error.message });
  }
};

// 3. Update an existing contact by ID
exports.updateContact = async (req, res) => {
  try {
    const updatedContact = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }, // returns the updated doc and runs schema validation
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating contact", error: error.message });
  }
};

// 4. Delete a contact by ID
exports.deleteContact = async (req, res) => {
  try {
    const deletedContact = await ContactInfo.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting contact", error: error.message });
  }
};
