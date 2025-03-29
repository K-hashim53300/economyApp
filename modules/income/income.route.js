import { Router } from "express";
import { addIncome, deleteIncome, getAllIncomes, updateIncome } from "./controller/income.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
import { validationMidd } from "../../middleware/validation.js";
import { addIncomeSchema } from "./validation/income.validation.js";

const router = Router();

//add income api route
router.post('/add',authMiddleware(),validationMidd(addIncomeSchema),addIncome);
//update income api route
router.put('/update/:id',updateIncome);
//delete income api route
router.delete('/delete/:id',deleteIncome);
//get all Income based on userId api route
router.get('/',authMiddleware(),getAllIncomes);
export default router;