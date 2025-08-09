const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String }, // Google profile image URL
  googleId: { type: String }, // Google's unique ID for the user,
  isAdmin: {type: Boolean},
  createdAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;