const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./starter/database");
const users = require("./routes/users");
const auth = require("./routes/auth");

// CONNECT TO DATABASE
connectDB();

// CALL CORS
app.use(cors());
app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth/login", auth);

// INITIALIZE PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
