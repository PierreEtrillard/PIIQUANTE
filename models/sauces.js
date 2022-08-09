const mongoose = require("mongoose");
const Sauces = mongoose.Schema({
  name: { type: String ,required: true},
  manufacturer: { type: String },
  description: { type: String },
  mainPepper: { type: String ,required: true},
  imageUrl: { type: String ,required: true},
  heat: { type: Number },
  userId: { type: String ,required: true},
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: Array },
  usersDisliked: { type: Array },
});

module.exports = mongoose.model("Sauce", Sauces);
