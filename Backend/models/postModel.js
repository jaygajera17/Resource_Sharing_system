const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  topic: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
