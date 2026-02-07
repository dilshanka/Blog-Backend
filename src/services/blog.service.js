const db = require("../config/db");

exports.saveBlog = async (blogData) => {
  const { title, content, summary, authorId } = blogData;

  const query = `
    INSERT INTO blogs (title, content, summary, user_id) 
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [title, content, summary, authorId]);
  return result;
};

exports.findAll = async (limit, offset) => {
  const query = `
    SELECT b.*, u.name as author_name 
    FROM blogs b 
    JOIN users u ON b.user_id = u.id 
    ORDER BY b.created_at DESC 
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.execute(query, [limit.toString(), offset.toString()]);
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows[0];
};

exports.update = async (id, updateData) => {
  const { title, content, summary } = updateData;
  const query = `
    UPDATE blogs 
    SET title = ?, content = ?, summary = ? 
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [title, content, summary, id]);
  return result;
};

exports.remove = async (id) => {
  const [result] = await db.execute("DELETE FROM blogs WHERE id = ?", [id]);
  return result;
};



