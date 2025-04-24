const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  description: String,
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scheduledDate: Date,
  status: { type: String, enum: ["open", "applied", "scheduled", "completed"], default: "open" }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
