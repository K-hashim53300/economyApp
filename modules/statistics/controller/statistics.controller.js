import { expenseModel } from "../../../DB/models/expense.model.js";
import { incomeModel } from "../../../DB/models/income.model.js";
import { memberModel } from "../../../DB/models/member.model.js";
import { statisticsModel } from "../../../DB/models/statistics.model.js";

//get all statistics function
export const getStatistics = async(req,res)=>{
    try {
        const  userId  = req.user._id;

        // Calculate the sum of all the user's income
        const totalIncomeFromIncomes = await incomeModel.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: "$incomeValue" } } }
        ]);
        const totalIncomeFromIncomeModel = totalIncomeFromIncomes[0]?.total || 0;
        // Calculate the sum of all salaries for family members
        const totalIncomeFromSalaries = await memberModel.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: "$salary" } } }
        ]);
        const totalIncomeFromMembers = totalIncomeFromSalaries[0]?.total || 0;
        // Calculate total income
        const totalIncome = totalIncomeFromIncomeModel + totalIncomeFromMembers;
        // Calculate the total expenses
        const totalExpenseFromExpenses = await expenseModel.aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, total: { $sum: "$expenseValue" } } }
        ]);
        const totalExpense = totalExpenseFromExpenses[0]?.total || 0;
        // Calculate the balance and percentage of expenses
        const balance = totalIncome - totalExpense;
        const expensePercentage = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
        // Calculate monthly expenses
        const monthlyExpenses = await expenseModel.aggregate([
            { $match: { userId } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m", date: "$expenseDate" } }, 
                    total: { $sum: "$expenseValue" } 
                } 
            },
            { $sort: { "_id": 1 } } // order by month
        ]).then(result =>
            result.map(entry => ({ month: entry._id, total: entry.total }))
        );
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
                monthlyExpenses
            });
            res.status(404).json({ status:"error",message:"There are no statistics for this user"})
        } else {
            userStatistics.totalIncome = totalIncome;
            userStatistics.totalExpense = totalExpense;
            userStatistics.balance = balance;
            userStatistics.expensePercentage = expensePercentage;
            userStatistics.monthlyExpenses = monthlyExpenses;
        }
        const savedStatistics = await userStatistics.save();
        res.status(200).json({ status:"success",message:"Done",savedStatistics});
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ error: "Error fetching user statistics" });
    }
}