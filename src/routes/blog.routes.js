const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const blog = require("../controllers/blog.controller");

router.post("/", verifyToken, blog.createBlog);
router.get("/", blog.getBlogs);
router.put("/:id", verifyToken, blog.updateBlog);
router.delete("/:id", verifyToken, blog.deleteBlog);

module.exports = router;
