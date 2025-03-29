import { Router } from "express";
import { addExpense, deleteExpense, getAllExpenses, updateExpense } from "./controller/expense.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { validationMidd } from "../../middleware/validation.js";
import { addExpenseSchema } from "./validation/expense.validation.js";

const router = Router();

//add expense api route
router.post('/add',authMiddleware(),validationMidd(addExpenseSchema),addExpense);
//update expense api route
router.put('/update/:id',updateExpense);
//delete expense api route
router.delete('/delete/:id',deleteExpense);
//get all Expenses based on userId api route
router.get('/',authMiddleware(),getAllExpenses);
export default router;