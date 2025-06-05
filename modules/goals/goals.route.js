import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { validationMidd } from "../../middleware/validation.js";
import { addGoalSchema } from "./validation/goals.validation.js";
import {
  addGoal,
  deleteGoal,
  getAllGoals,
  updateGoal,
} from "./controller/goals.controller.js";

const router = Router();
//add goal api route
router.post("/add", authMiddleware(), validationMidd(addGoalSchema), addGoal);
//update goal api route
router.put("/update/:id", updateGoal);
//delete goal api route
router.delete("/delete/:id", deleteGoal);
//get all goals based on userId
router.get("/", authMiddleware(), getAllGoals);

export default router;
