import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: String, required: true },
//   response: { type: String, required: true },
  reasoning: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export const chatModel = mongoose.model("Chat", chatSchema);
