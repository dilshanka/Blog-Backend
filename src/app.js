require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const initializeDatabase = require("./utils/initializeDb");

const PORT = process.env.PORT || 5000;

app.use("/api", require("./routes/common.routes"));


(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize DB; exiting.", err);
    process.exit(1);
  }
})();
