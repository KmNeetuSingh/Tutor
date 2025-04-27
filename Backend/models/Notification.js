const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { 
    type: String, 
    enum: ["new_request", "request_accepted", "request_rejected", "request_completed", "profile_update"], 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedRequest: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema); 