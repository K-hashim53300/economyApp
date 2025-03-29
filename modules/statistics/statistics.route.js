import { Router } from "express";
import { getStatistics } from "./controller/statistics.controller.js";
import { authMiddleware } from "../../middleware/auth.js";
const router = Router();

//get all statistics api route
router.get('/',authMiddleware(),getStatistics);
export default router;