const db = require("../config/db");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, "../../schema.sql");
    if (!fs.existsSync(schemaPath)) {
      console.warn("schema.sql not found, skipping DB initialization");
      return;
    }

    const schema = fs.readFileSync(schemaPath, "utf8");
    const rawStatements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of rawStatements) {
      try {
        if (/^USE\s+/i.test(statement)) continue;

        await db.query(statement);
      } catch (err) {
        const msg = String(err.message || "");
        const code = err.code || "";
        if (
          msg.includes("already exists") ||
          msg.includes("Duplicate") ||
          code === "ER_DB_CREATE_EXISTS" ||
          code === "ER_TABLE_EXISTS_ERROR"
        ) {
          continue;
        }
        console.error("Error executing schema statement:", err);
      }
    }

    console.log("Database schema initialization completed.");
  } catch (err) {
    console.error("Failed to initialize database schema:", err);
  }
}

module.exports = initializeDatabase;
