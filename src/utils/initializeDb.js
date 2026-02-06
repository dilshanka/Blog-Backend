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
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // Run statements sequentially to preserve order (CREATE TABLE with FKs)
    for (const statement of rawStatements) {
      try {
        // Skip USE statements to avoid switching DB; connection already uses desired DB
        if (/^USE\s+/i.test(statement)) continue;

        await db.promise().query(statement);
      } catch (err) {
        // Ignore errors for objects that already exist
        const msg = String(err.message || "");
        if (msg.includes("already exists") || msg.includes("Duplicate") || msg.includes("ER_TABLE_EXISTS_ERROR")) {
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