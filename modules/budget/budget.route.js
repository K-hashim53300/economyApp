import { Router } from "express";
import { addBudgetCategory, deleteBudgetCategory, getAllSuggestedBudgets, getBudgetCategoryByName, suggestedBudget, updateBudgetPercentage } from "./budget.controller.js";
import {authMiddleware} from '../../middleware/auth.js';
const router = Router();

router.post('/',authMiddleware(),suggestedBudget);
router.put('/',authMiddleware(),updateBudgetPercentage);
router.delete('/', authMiddleware() , deleteBudgetCategory);
router.get('/:category',authMiddleware(), getBudgetCategoryByName);
router.get('/', authMiddleware() , getAllSuggestedBudgets);
router.post('/add-category', authMiddleware(),addBudgetCategory);
export default router;