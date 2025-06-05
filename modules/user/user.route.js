import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { deleteUser, getUserChat, profile, updatePassword, updateUser } from "./controller/user.controller.js";
import { validationMidd } from "../../middleware/validation.js";
import { updatePasswordSchema, updateUserSchema } from "./validation/user.validation.js";

const router = Router();
//update user api route
router.put('/update/:id',validationMidd(updateUserSchema),updateUser);
//delet user and all his data api route
router.delete("/delete",authMiddleware(),deleteUser);
//get profile api route
router.get('/profile',authMiddleware(),profile);
//update password api route
router.patch('/update-password',authMiddleware(),validationMidd(updatePasswordSchema),updatePassword);
//get user chat api route (endpoint)
router.get('/chat',authMiddleware(),getUserChat);
export default router;