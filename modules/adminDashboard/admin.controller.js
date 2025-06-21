import { adminDashboardModel } from "../../DB/models/adminDash.model.js";
import { expenseModel } from "../../DB/models/expense.model.js";
import { incomeModel } from "../../DB/models/income.model.js";
import { userModel } from "../../DB/models/user.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // Total number of users
    const totalUsers = await userModel.countDocuments();
    // Total incomes for all users
    const totalIncome = await incomeModel.aggregate([
      { $group: { _id: null, total: { $sum: "$incomeValue" } } }
    ]);
    // Total expenses for all users
    const totalExpenses = await expenseModel.aggregate([
      { $group: { _id: null, total: { $sum: "$expenseValue" } } }
    ]);

    // The most spending categories
    const topCategories = await expenseModel.aggregate([
      {
        $group: {
          _id: "$expenseType",
          total: { $sum: "$expenseValue" }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);
const totalIncomeValue = totalIncome[0]?.total || 0;
const totalExpensesValue = totalExpenses[0]?.total || 0;

const formattedTopCategories = topCategories.map(cat => ({
  category: cat._id,
  total: cat.total
}));
    // Count users by class
    const classAUsers = await userModel.countDocuments({ class: "A" });
    const classBUsers = await userModel.countDocuments({ class: "B" });
    const classCUsers = await userModel.countDocuments({ class: "C" });

const newAdminStatistics = await adminDashboardModel.create({
  totalUsers,
  totalIncome: totalIncomeValue,
  totalExpenses: totalExpensesValue,
  balance: totalIncomeValue - totalExpensesValue,
  topCategories: formattedTopCategories,
  classAUsers,
  classBUsers,
  classCUsers
});
    return res.status(200).json({
      status: 'success',
      message:"Data for admin fetced successfully",
      newAdminStatistics
    });

  } catch (error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
};
