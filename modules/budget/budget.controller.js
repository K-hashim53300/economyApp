import { budgetModel } from "../../DB/models/budget.model.js";
import { expenseModel } from "../../DB/models/expense.model.js";
import { statisticsModel } from "../../DB/models/statistics.model.js";

// Suggested-Budget Planner function
export const suggestedBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const statistc = await statisticsModel.findOne({ userId });
    const totalIncome = statistc?.totalIncome ?? 0;
    // Egyptian specific budget guidelines
    const budget_guidelines = {
      "HousingRent": 0.3,
      "Foods": 0.22,
     "Utilities": 0.1,
      "Transportation": 0.1,
      "Education": 0.1,
      "Healthcare": 0.04,
      "Entertainment": 0.04,
    };
    const suggested_budget = Object.entries(budget_guidelines).map(
      ([category, percentage]) => ({
        category,
        percentage: percentage * 100,
        amount: +(totalIncome * percentage).toFixed(2),
      })
    );
    const newBudget = await budgetModel.create({
      userId,
      totalIncome,
      suggested_budget,
    });
//Convert each budget item to an Expense
    const expenses = suggested_budget.map(item => ({
      userId,
      expenseType: item.category,
      expenseValue: item.amount,
      description: 'Auto-generated from suggested budget',
      expenseDate: new Date()
    }));
    await expenseModel.insertMany(expenses);
   return res
      .status(201)
      .json({
        status: "success",
        message: "Suggested budget created successfully",
        newBudget,
      });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};
// Update Budget percentage by userId and category
export const updateBudgetPercentage = async (req, res) => {
  try {
    const { category, percentage } = req.body;
    const userId = req.user._id;
    if (!category || percentage == null) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "category, and percentage are required.",
        });
    }

    // totalIncome
    const budget = await budgetModel.findOne({ userId });

    if (!budget) {
      return res
        .status(404)
        .json({ status: "fail", message: "Budget not found for this user." });
    }

    const totalIncome = budget.totalIncome;

    // new amount
    const amount = +(totalIncome * (percentage / 100)).toFixed(2);

    // update category
    const updated = await budgetModel.findOneAndUpdate(
      {
        userId,
        "suggested_budget.category": category,
      },
      {
        $set: {
          "suggested_budget.$.percentage": percentage,
          "suggested_budget.$.amount": amount,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ status: "fail", message: "Category not found." });
    }
   // updated in expenses table
      await expenseModel.updateMany(
      { userId, expenseType: category },
      { $set: { expenseValue: amount } }
    );
    res.status(200).json({
      status: "success",
      message: "Percentage updated and amount recalculated successfully.",
      updatedBudget: updated,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
//Delete Budget Category by category name
export const deleteBudgetCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category } = req.body;

    if (!category) {
      return res
        .status(400)
        .json({ status: "fail", message: "Category is required." });
    }

    const updated = await budgetModel.findOneAndUpdate(
      { userId },
      { $pull: { suggested_budget: { category } } },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({
          status: "fail",
          message: "Budget not found or category not matched.",
        });
    }
   // delete from expenses table
    await expenseModel.deleteMany({
      userId,
      expenseType: category,
    });
    res.status(200).json({
      status: "success",
      message: `Category "${category}" deleted successfully.`,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
//Get Category Budget by category name from params
export const getBudgetCategoryByName = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category } = req.params;

    if (!category) {
      return res
        .status(400)
        .json({ status: "fail", message: "Category is required." });
    }

    const budget = await budgetModel.findOne({ userId });

    if (!budget) {
      return res
        .status(404)
        .json({ status: "fail", message: "Budget not found for this user." });
    }

    const categoryData = budget.suggested_budget.find(
      (item) => item.category === category
    );

    if (!categoryData) {
      return res
        .status(404)
        .json({ status: "fail", message: "Category not found." });
    }

    res.status(200).json({
      status: "success",
      category: categoryData,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
// Get All Suggested Budgets
export const getAllSuggestedBudgets = async (req, res) => {
  try {
    const all = await budgetModel.find();
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
//add budget catgory to suggested budegt
export const addBudgetCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, percentage } = req.body;

    if (!category || percentage == null) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "category and percentage are required.",
        });
    }

    const budget = await budgetModel.findOne({ userId });

    if (!budget) {
      return res
        .status(404)
        .json({ status: "fail", message: "Budget not found for this user." });
    }

    const alreadyExists = budget.suggested_budget.find(
      (item) => item.category === category
    );
    if (alreadyExists) {
      return res
        .status(400)
        .json({ status: "fail", message: "Category already exists." });
    }

    const amount = +(budget.totalIncome * (percentage / 100)).toFixed(2);

    const newCategory = {
      category,
      percentage,
      amount,
    };

    budget.suggested_budget.push(newCategory);
    await budget.save();
    // Also Add to expenses
    await expenseModel.create({
      userId,
      expenseType: category,
      expenseValue: amount,
      description: `Auto-created from budget category "${category}"`,
    });
    return res.status(201).json({
      status: "success",
      message: "Category added successfully.",
      newCategory,
    });
  } catch (error) {
    return res.status(500).json({ status: "fail", message: error.message });
  }
};
