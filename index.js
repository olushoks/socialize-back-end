const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./starter/database");

// CALL CORS
app.use(cors());

// CONNECT TO DATABASE
connectDB();

const PORT = process.env.PORT || 5000;

// INITIALIZE PORT
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
