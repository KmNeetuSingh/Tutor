const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  savedRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }]
});

module.exports = mongoose.model("User", userSchema);
