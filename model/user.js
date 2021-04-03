const mongoose = require("mongoose");
const Joi = require("joi");
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

// VALIDATE FUNCTION
function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(2).max(10).required(),
    password: Joi.string().min(8).max(15).required(),
    about: Joi.string().min(1).max(100),
  });
  return schema.validate(user);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validateUser;
