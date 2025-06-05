import mongoose from "mongoose";

const goalsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currentSavings: {
      type: Number,
      default: 0,
    },
    monthlySavings: {
      type: Number,
      required:true,
      default: 0,
    },
    timeline: {
      type: Number, // numbers of month to achive goal
      required: true,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
export const goalsModel = mongoose.model("Goal", goalsSchema);
