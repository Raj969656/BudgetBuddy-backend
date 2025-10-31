import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.js";
import { createUser } from "../controllers/user.controller.js";

const authRouter = Router();

authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);

export default authRouter;
