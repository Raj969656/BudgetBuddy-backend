import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.js";
import { createUser } from "../controllers/user.controller.js";

const authRouter = Router();

// ✅ Correct paths
authRouter.post("/login", loginUser);
authRouter.post("/register", createUser);

export default authRouter;
