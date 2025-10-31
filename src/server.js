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

// Load environment variables
dotenv.config();

// Connect to database
connectDb();

const app = express();

// ✅ FIXED CORS CONFIG
app.use(
  cors({
    origin: [
      "https://sweet-duckanoo-b3b3dc.netlify.app",
      "https://6905094c0ef96a618725ca1e--sweet-duckanoo-b3b3dc.netlify.app", // Netlify preview link
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);

// Protected routes (after auth)
app.use(authMiddleware);
app.use("/api/expenses", expenseRouter);
app.use("/api/users", userRouter);

// Error handlers
app.use(notFount);
app.use(errorHandler);

// Root test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to expense backend." });
});

// ✅ Dynamic port for Render
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
