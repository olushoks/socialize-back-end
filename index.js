const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./starter/database");
const users = require("./routes/users");

// CONNECT TO DATABASE
connectDB();

// CALL CORS
app.use(cors());
app.use(express.json());
app.use("/api/users", users);

// INITIALIZE PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
