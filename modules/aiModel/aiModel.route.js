import { Router } from "express";
import multer from "multer";
import { chatWithAdvisor, deleteChatWithAdvisor, uploadCSVFile } from "./aiModel.controller/aiModel.controller.js";
import { adminMiddleware, authMiddleware } from "../../middleware/auth.js";
const router =Router();
//upload data as csv file
const upload = multer({ storage: multer.memoryStorage() });
router.post('/upload-price-data',authMiddleware(),adminMiddleware(),upload.single('file'),uploadCSVFile);
//chatbot endpoint
router.post('/chat',authMiddleware(),chatWithAdvisor);
//delete chat
router.delete('/chat',authMiddleware(),deleteChatWithAdvisor);
export default router;
