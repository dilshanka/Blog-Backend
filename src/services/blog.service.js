const db = require("../config/db");

/**
 * Requirement: Create a blog and store a generated summary [cite: 19, 20]
 */
exports.saveBlog = async (blogData) => {
  const { title, content, summary, authorId } = blogData;
  
  const query = `
    INSERT INTO blogs (title, content, summary, author_id) 
    VALUES (?, ?, ?, ?)
  `;
  
  const [result] = await db.execute(query, [title, content, summary, authorId]);
  return result;
};

/**
 * Requirement: Get all blogs with Pagination 
 */
exports.findAll = async (limit, offset) => {
  // We use SQL_CALC_FOUND_ROWS to help with metadata if you want to return total counts
  const query = `
    SELECT b.*, u.name as author_name 
    FROM blogs b 
    JOIN users u ON b.author_id = u.id 
    ORDER BY b.created_at DESC 
    LIMIT ? OFFSET ?
  `;
  
  const [rows] = await db.execute(query, [limit.toString(), offset.toString()]);
  return rows;
};

/**
 * Requirement: Get blog by ID [cite: 34]
 */
exports.findById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM blogs WHERE id = ?", [id]);
  return rows[0];
};

/**
 * Requirement: Update blog (Owner or Admin check is in the controller) [cite: 35]
 */
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

/**
 * Requirement: Delete blog (Admin only check is in the middleware/controller) [cite: 36]
 */
exports.remove = async (id) => {
  const [result] = await db.execute("DELETE FROM blogs WHERE id = ?", [id]);
  return result;
};