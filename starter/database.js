const mongoose = require("mongoose");
const config = require("config");

function connectDB() {
  mongoose
    .connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to MongoDB Socialize DB`))
    .catch((err) => {
      console.log(`Unable to connect`);
      process.exit(1);
    });
}

module.exports = connectDB;
