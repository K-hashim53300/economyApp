import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.js";
import { validationMidd } from "../../middleware/validation.js";
import { addMemberSchema } from "./validation/member.validation.js";
import { addMember, deleteMember, getAllMembers, getMemberByMemberName, updateMember } from "./controller/member.controller.js";
import { handleMulterErr, myMulter, validationType } from "../../services/multer.js";

const router = Router();
//add member api route 
//note this Api post in form-data

router.post('/add',authMiddleware(),myMulter(validationType.image).single("image"),handleMulterErr,addMember);
//update member api route
router.put("/update/:id",myMulter(validationType.image).single("image"),handleMulterErr,updateMember);
//delete member api route
router.delete("/delete/:id",deleteMember);
//get all member based on userId from token api route
router.get('/',authMiddleware(),getAllMembers);
//get member by memberName
router.get("/:memberName",getMemberByMemberName);
export default router;