const userService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    await userService.createUser(req.body);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await userService.validatePassword(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};