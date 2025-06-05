import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalIncome: {
      type: Number,
      required: true,
      default: 0,
    },
    totalExpense: {
      type: Number,
      required: true,
      default: 0,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    expensePercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    monthlyExpenses: [
      {
        month: {
          type: String,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    monthlyIncomes: [
      {
        month: {
          type: String,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    topExpenses: [
      {
        category: String,
        total: Number,
      },
    ],
    topSavingMonths: [{ month: String, saving: Number }],
  },
  { timestamps: true }
);

export const statisticsModel = mongoose.model("Statistics", statisticsSchema);
