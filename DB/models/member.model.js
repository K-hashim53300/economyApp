import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    memberName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    birthday: {
      type: Date,
    },
    image: {
      type: String,
    },
    roleInFamily: {
      type: String,
      required: true,
    },
    job: {
      type: String,
    },
    salary: {
      type: Number,
    },
  },
  { timestamps: true }
);
export const memberModel = mongoose.model("Member", memberSchema);
