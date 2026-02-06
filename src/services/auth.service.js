const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.createUser = async (userData) => {
  const { name, email, password, role } = userData;
  const hashed = await bcrypt.hash(password, 10);
  
  const [result] = await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashed, role || 'User']
  );
  return result;
};

exports.findUserByEmail = async (email) => {
  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return users[0];
};

exports.validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};