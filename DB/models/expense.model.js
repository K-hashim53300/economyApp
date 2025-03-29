import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expenseType: {
    type: String,
    required: true,
  },
  expenseValue: {
    type: Number,
    required: true,
  },
  description:{
    type:String,
    max:500
  },
  expenseDate: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});
export const expenseModel = mongoose.model("Expense", expenseSchema);
