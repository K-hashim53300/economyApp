import { expenseModel } from "../../../DB/models/expense.model.js";

//add expense function
export const addExpense = async (req, res) => {
  try {
    let { expenseType, expenseValue, description } = req.body;
    const userId = req.user._id; //get user._id from authMiddleware
    if (!expenseType || !expenseValue) {
      res.status(404).json({ status:"error", message: "expense type and value are required" });
    } else {
      const newexpense = new expenseModel({
        userId,
        expenseType,
        expenseValue,
        description,
      }); //save in model
      const savedexpense = await newexpense.save(); //save in  database
      res
        .status(201)
        .json({ status:"success", message: "Your expense added successfully", savedexpense });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//update expense function
export const updateExpense = async (req, res) => {
  try {
    let { id } = req.params;
    //found expense
    const foundExpense = await expenseModel.findById(id);
    if (foundExpense) {
      //update expense by id
      const updatedExpense = await expenseModel.findByIdAndUpdate(
        foundExpense._id,
        { $set: req.body },
        { new: true }
      );
      res
        .status(200)
        .json({ status:"success", message: "Expense updated successfully", updatedExpense });
    } else {
      res.status(404).json({ status:"error", message: "This expense not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//delete expense function
export const deleteExpense = async (req, res) => {
  try {
    let { id } = req.params;
    const foundExpense = await expenseModel.findById(id);
    if (foundExpense) {
      //delete expense by id
      await expenseModel.findByIdAndDelete(foundExpense._id);
      res.status(200).json({ status:"success", message: "Expense deleted successfully" });
    } else {
      res.status(404).json({ status:"error", message: "This expense not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get all expenses based on userId
export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    if (userId) {
      //get all expenses
      const expenses = await expenseModel.find({ userId });
      if (!expenses.length) {
        res
          .status(404)
          .json({ status:"error", message: "This user doesn't have any expenses " });
      } else {
        res.status(200).json({ status:"success", message: "Done", expenses });
      }
    } else {
      res.status(403).json({ status:"error", message: "invalid userId" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
