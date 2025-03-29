import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  incomeType: {
    type: String,
    required: true,
  },
  incomeValue: {
    type: Number,
    required: true,
  },
  incomeDate: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});
export const incomeModel = mongoose.model("Income", incomeSchema);
