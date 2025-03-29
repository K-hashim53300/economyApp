import { Router } from "express";
import { confirmEmail, forgetPassword, logIn, logOut, sendCode, signUp } from "./controller/auth.controller.js";
import { validationMidd } from "../../middleware/validation.js";
import { forgetPasswordSchema, logInSchema, sendCodeSchema, signUpSchema } from "./validation/auth.validation.js";

const router = Router();

//signup api route
router.post('/signup',validationMidd(signUpSchema),signUp);
//login api route
router.post('/login',validationMidd(logInSchema),logIn);
//confirm account api route
router.get("/confirm/:token",confirmEmail);
//send code api route 
router.post("/send-code",validationMidd(sendCodeSchema),sendCode);
//forget password api route
router.post("/forget-password",validationMidd(forgetPasswordSchema),forgetPassword);
//logout api route
router.get('/logout',logOut);
export default router;