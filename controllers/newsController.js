const News = require("../models/News");

// Utility function for error logging
const handleError = (res, error, message = "Server Error", status = 500) => {
  console.error(error);
  return res.status(status).json({ message });
};

// Get all news (Public)
exports.getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).lean(); // Newest first
    res.json(news);
  } catch (error) {
    handleError(res, error, "Error fetching news");
  }
};

// Get single news item by ID
exports.getNewsById = async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id).lean();
    if (!newsItem) return res.status(404).json({ message: "News not found" });
    res.json(newsItem);
  } catch (error) {
    handleError(res, error, "Error fetching news item");
  }
};

// Create news (Protected)
exports.createNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Simple input validation
    if (!title || !content || !category) {
      return res
        .status(400)
        .json({ message: "Title, content, and category are required" });
    }

    const newPost = new News({
      title,
      content,
      category,
      author: req.user._id, // Ensure only the user ID is stored
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    handleError(res, error, "Error creating news", 400);
  }
};

// Update existing news (Protected)
exports.updateNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    // Update fields
    news.title = title || news.title;
    news.content = content || news.content;
    news.category = category || news.category;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    handleError(res, error, "Error updating news", 400);
  }
};

// Delete news (Protected)
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });

    // Authorization check: only author can delete
    if (news.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await news.remove();
    res.json({ message: "Post removed" });
  } catch (error) {
    handleError(res, error, "Error deleting news", 400);
  }
};
