
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import expenseRouter from "./routes/expense.route.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import aiRouter from "./routes/ai.route.js";

import { authMiddleware } from "./middlewares/auth.middleware.js";
import { notFount, errorHandler } from "./errors/error.js";
import connectDb from "./config/db.js";

dotenv.config();

// connect database
connectDb();

const app = express();

app.use(
  cors({
    origin: "https://budgetbuddy96.netlify.app/", // frontend port
  })
);

app.use(express.json());

// Routes
app.use("/api", authRouter);


// AI routes

app.use("/api/ai", aiRouter); 
// Auth middleware
app.use(authMiddleware);

// App routes
app.use("/api", expenseRouter);
app.use("/api", userRouter);


// Error handlers
app.use(notFount);
app.use(errorHandler);

// Root test
app.get("/", (req, resp) => {
  resp.json({ message: "Welcome to expense backend." });
});

app.listen(8081, () => {
  console.log("✅ Server started on http://localhost:8081");
});
