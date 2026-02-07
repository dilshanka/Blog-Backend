const blogService = require("../services/blog.service");

exports.createBlog = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;
  

  console.log("Creating blog with title:", title);
  console.log("Author ID:", authorId);

  try {
    const summary =
      content.length > 150 ? content.substring(0, 147) + "..." : content;

    const result = await blogService.saveBlog({
      title,
      content,
      summary,
      authorId,
    });

    res.status(201).json({
      message: "Blog created successfully",
      blogId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const blogs = await blogService.findAll(limit, offset);
    res.json({
      page,
      limit,
      data: blogs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await blogService.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {

    console.log("Updating blog with ID:", req.params.id);


  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const blog = await blogService.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const isOwner = blog.author_id === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Access denied: You are not the owner or an admin" });
    }

    const summary = content
      ? content.length > 150
        ? content.substring(0, 147) + "..."
        : content
      : blog.summary;

    await blogService.update(id, { title, content, summary });
    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const result = await blogService.remove(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Blog not found" });

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await blogService.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
