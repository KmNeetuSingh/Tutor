import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  subject: String,
  description: String,
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  scheduledAt: Date,
});

export default mongoose.model("Request", requestSchema);
