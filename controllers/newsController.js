const News = require("../models/News");

// Get all news (Public)
exports.getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // Newest first
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};
// Get single news item by ID
exports.getNewsById = async (req, res) => {
  console.log("Fetching news item with ID:", req.params.id);
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) return res.status(404).json({ message: "Not found" });
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching article" });
  }
};
// Create news (Protected)
exports.createNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newPost = new News({
      title,
      content,
      category,
      author: req.user, // Added by our protect middleware
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: "Error creating post" });
  }
};
// Update existing news (Protected)
exports.updateNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true, runValidators: true }, // returns the updated document
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News post not found" });
    }

    res.json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: "Error updating post" });
  }
};

// Delete news (Protected)
exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "Post removed" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting post" });
  }
};
