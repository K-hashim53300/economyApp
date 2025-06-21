import { expenseModel } from "../../../DB/models/expense.model.js";
import { incomeModel } from "../../../DB/models/income.model.js";
import { memberModel } from "../../../DB/models/member.model.js";
import { statisticsModel } from "../../../DB/models/statistics.model.js";
import { userModel } from "../../../DB/models/user.model.js";

//get all statistics function
export const getStatistics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Calculate the sum of all the user's income
    const totalIncomeFromIncomes = await incomeModel.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$incomeValue" } } },
    ]);
    const totalIncomeFromIncomeModel = totalIncomeFromIncomes[0]?.total || 0;
    // Calculate the sum of all salaries for family members
    const totalIncomeFromSalaries = await memberModel.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$salary" } } },
    ]);
    const totalIncomeFromMembers = totalIncomeFromSalaries[0]?.total || 0;
    // Calculate total income
    const totalIncome = totalIncomeFromIncomeModel + totalIncomeFromMembers;
    //Classification user class[A,B,C] based on total income
    let userClass = 'C';
    if(totalIncome > 40000){
      userClass = 'A'; 
    }else if(totalIncome >= 20000){
      userClass = 'B';
    }else{
      userClass = 'C';
    }
    // Calculate the total expenses
    const totalExpenseFromExpenses = await expenseModel.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$expenseValue" } } },
    ]);
    const totalExpense = totalExpenseFromExpenses[0]?.total || 0;
    // Calculate the balance and percentage of expenses
    const balance = totalIncome - totalExpense;
    const expensePercentage =
      totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
    // Calculate monthly expenses
    const monthlyExpenses = await expenseModel
      .aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $dateToString: { format: "%m-%Y", date: "$expenseDate" } },
            total: { $sum: "$expenseValue" },
          },
        },
        { $sort: { _id: 1 } }, // order by month
      ])
      .then((result) =>
        result.map((entry) => ({ month: entry._id, total: entry.total }))
      );
    // Calculate monthly incomes
    const monthlyIncomes = await incomeModel
      .aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: { $dateToString: { format: "%m-%Y", date: "$incomeDate" } },
            total: { $sum: "$incomeValue" },
          },
        },
        { $sort: { _id: 1 } }, // order by month
      ])
      .then((result) =>
        result.map((entry) => ({ month: entry._id, total: entry.total }))
      );
      // top 3 expenses
const topExpenses = await expenseModel.aggregate([
  { $match: { userId } },
  {
    $group: {
      _id: "$expenseType",
      total: { $sum: "$expenseValue" }
    }
  },
  { $sort: { total: -1 } },
  { $limit: 3 }
]).then(res =>
  res.map(item => ({
    category: item._id,
    total: item.total
  }))
);
//top 3 months in saving
const topMonthsSaving = monthlyIncomes.map((incomeMonth) => {
  const expenseMonth = monthlyExpenses.find(e => e.month === incomeMonth.month);
  const expense = expenseMonth?.total || 0;
  return {
    month: incomeMonth.month,
    saving: incomeMonth.total - expense
  };
}).sort((a, b) => b.saving - a.saving).slice(0, 3);
    //  Update or create a new record in `StatisticsModel`
    let userStatistics = await statisticsModel.findOne({ userId });
    // If this user has no statistics, create them
    if (!userStatistics) {
      userStatistics = new statisticsModel({
        userId,
        totalIncome,
        totalExpense,
        balance,
        expensePercentage,
        monthlyExpenses,
        monthlyIncomes,
        topExpenses,
        topMonthsSaving
      });
      const savedStatistics = await userStatistics.save();
      return res.status(201).json({
        status: "success",
        message: "Statistics created successfully.",
        savedStatistics,
      });
    } else {
      userStatistics.totalIncome = totalIncome;
      userStatistics.totalExpense = totalExpense;
      userStatistics.balance = balance;
      userStatistics.expensePercentage = expensePercentage;
      userStatistics.monthlyExpenses = monthlyExpenses;
      userStatistics.monthlyIncomes = monthlyIncomes;
      userStatistics.topExpenses= topExpenses;
      userStatistics.topSavingMonths= topMonthsSaving;
    }
    await userModel.findByIdAndUpdate(userId,{class:userClass});
    const savedStatistics = await userStatistics.save();
    return res
      .status(200)
      .json({
        status: "success",
        message: "Fetched user statistics",
        savedStatistics,
      });
  } catch (error) {
    return res.status(500).json({status:"fail",message:error.message});
  }
};
