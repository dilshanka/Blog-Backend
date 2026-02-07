const db = require("../config/db");

exports.getAllUsers = async () => {
    const [rows] = await db.execute("SELECT id, name, email FROM users");
    return rows;
}


exports.findById = async (id) => {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
}



