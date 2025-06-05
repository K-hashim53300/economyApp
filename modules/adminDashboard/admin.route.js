import { Router } from "express";
import { adminMiddleware, authMiddleware } from "../../middleware/auth.js";
import { getAdminDashboard } from "./admin.controller.js";

const router = Router();
//Get data for admin only
router.get('/dashboard',authMiddleware(),adminMiddleware(),getAdminDashboard);
export default router;