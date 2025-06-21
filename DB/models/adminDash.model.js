// DB/models/adminDash.model.js
import mongoose from "mongoose";

const topCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  total: { type: Number, required: true }
});

const adminDashboardSchema = new mongoose.Schema(
  {
    totalUsers: {
      type: Number,
      required: true,
    },
    totalIncome: {
      type: Number,
      required: true,
    },
    totalExpenses: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    topCategories: [topCategorySchema],
    classAUsers: {
      type: Number,
      required: true,
    },
    classBUsers: {
      type: Number,
      required: true,
    },
    classCUsers: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const adminDashboardModel = mongoose.model(
  "AdminDashboard",
  adminDashboardSchema
);
