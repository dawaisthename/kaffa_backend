const TeamMember = require("../models/Team");

// Create a new team member
exports.createMember = async (req, res) => {
  try {
    // Spread the body and add the image path if a file exists
    const memberData = {
      ...req.body,
      profileImageUrl: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "",
    };

    const newMember = new TeamMember(memberData);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all team members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await TeamMember.find({ isActive: true });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single team member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update team member info
exports.updateMember = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // If a new image is uploaded, update the URL
    if (req.file) {
      updateData.profileImageUrl = `/${req.file.path}`;
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedMember)
      return res.status(404).json({ message: "Member not found" });
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Delete (or deactivate) a team member
exports.deleteMember = async (req, res) => {
  try {
    // Soft delete by setting isActive to false
    await TeamMember.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(200).json({ message: "Member deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
