const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/role.middleware");
const user = require("../controllers/user.controller");

router.get("/", verifyToken, adminMiddleware, user.getAllUsers);
router.get("/:id", verifyToken, user.getUserById);

module.exports = router;
