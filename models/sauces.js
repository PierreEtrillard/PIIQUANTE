const mongoose = require("mongoose");
const Sauces = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: String },
  usersDisliked: { type: String },
});

module.exports = mongoose.model("Sauce", Sauces);
