const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
  content: { type: String, minlength: 1, maxlength: 1000 },
  likes: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now() },
});

const Post = mongoose.model("Post", postSchema);

// VALIDATE FUNCTION
function validatePost(post) {
  const schema = Joi.object({
    content: Joi.string().min(1).max(1000),
    likes: Joi.number(),
  });
  schema.validate(post);
}

exports.postSchema = postSchema;
exports.Post = Post;
exports.validatePost = validatePost;
