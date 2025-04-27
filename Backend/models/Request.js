const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  budget: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected", "completed"], 
    default: "pending" 
  }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
