import mongoose from 'mongoose';
const BudgetCategorySchema = new mongoose.Schema({
  category: String,
  percentage: Number,
  amount: Number
}, { _id: false });

const SuggestedBudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalIncome: { type: Number, required: true },
  suggested_budget: [BudgetCategorySchema],
  createdAt: { type: Date, default: Date.now }
});

export const budgetModel =  mongoose.model('SuggestedBudget', SuggestedBudgetSchema);
