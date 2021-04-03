const mongoose = require("mongoose");
const JOI = require("joi");
const fs = require("fs");
const multer = require("multer");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 2,
    maxlength: 10,
    required: true,
    unique: true,
  },
  password: { type: String, minlength: 8, maxlength: 15, required: true },
  about: { type: String, minlength: 1, maxlength: 100 },
  profilePicture: { data: Buffer, contentType: String },
  posts: { type: [postSchema], default: [] },
  isOnline: { type: Boolean, default: false },
  friends: { default: [] },
  pendingRequest: { default: [] },
  signUpDate: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
