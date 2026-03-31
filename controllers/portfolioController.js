const Portfolio = require("../models/Portfolio");

// Utility function for error logging
const handleError = (res, error, message = "Server Error", status = 500) => {
  console.error(error);
  return res.status(status).json({ message });
};

// Get all portfolio items (With Filtering)
exports.getPortfolio = async (req, res) => {
  try {
    const { sector, region } = req.query;
    let filter = {};

    // Apply filters only if they aren't "All"
    if (sector && sector !== "All") {
      filter.sector = sector;
    }
    if (region && region !== "All") {
      filter.region = region;
    }

    const items = await Portfolio.find(filter).sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (error) {
    handleError(res, error, "Error fetching portfolio items");
  }
};

// Get single portfolio item by ID
exports.getPortfolioById = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id).lean();
    if (!item)
      return res.status(404).json({ message: "Portfolio item not found" });
    res.json(item);
  } catch (error) {
    handleError(res, error, "Error fetching portfolio item");
  }
};

// Create portfolio item (Protected)
exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, sector, region, icon } = req.body;

    // Validation
    if (!title || !description || !sector || !region) {
      return res.status(400).json({
        message: "Title, description, sector, and region are required",
      });
    }

    const newItem = new Portfolio({
      title,
      description,
      sector,
      region,
      icon,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    handleError(res, error, "Error creating portfolio item", 400);
  }
};

// Update portfolio item (Protected)
exports.updatePortfolio = async (req, res) => {
  try {
    const updates = req.body;

    // findByIdAndUpdate is cleaner for multi-field updates
    const updatedItem = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (error) {
    handleError(res, error, "Error updating portfolio item", 400);
  }
};

// Delete portfolio item (Protected)
exports.deletePortfolio = async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Portfolio item removed successfully" });
  } catch (error) {
    handleError(res, error, "Error deleting portfolio item", 400);
  }
};
