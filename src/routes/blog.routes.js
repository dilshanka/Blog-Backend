const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const blog = require("../controllers/blog.controller");
const adminMiddleware = require("../middlewares/role.middleware");


router.post("/", verifyToken, blog.createBlog);
router.get("/", blog.getBlogs);
router.put("/:id", verifyToken, blog.updateBlog);
router.delete("/:id", verifyToken,adminMiddleware, blog.deleteBlog);
router.get("/:id", blog.getBlogById);

module.exports = router;
