import express from "express";
import { chatWithAi } from "../controllers/ai.controller.js";

const router = express.Router();

// 👇 Route for AI chat
router.post("/chat", chatWithAi);

export default router;
