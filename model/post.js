const mongoose = require("mongoose");
const JOI = require("joi");

const postSchema = new mongoose.Schema({
  post: { type: String, minlength: 1, maxlength: 1000 },
  dateCreated: { type: Date, default: Date.now() },
});

const Post = mongoose.model("Post", postSchema);
