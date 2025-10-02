// //import express
// import express from "express";
// import expenseRouter from "./routes/expense.route.js";
// import userRouter from "./routes/user.route.js";
// import { authMiddleware } from "./middlewares/auth.middleware.js";
// import { notFount, errorHandler } from "./errors/error.js";
// import connectDb from "./config/db.js";
// import cors from "cors";
// import authRouter from "./routes/auth.route.js";
// import aiRouter from "./routes/ai.route.js";
// import dotenv from 'dotenv';
// dotenv.config();

// // import dotenv from "dotenv";
// // dotenv.config({
// //   path: "../.env",
// // });
// // express to get app
// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//   })
// );

// //it will parse your json
// app.use(express.json());
// // routes
// // example of middleware
// app.use("/api", authRouter);
// //auth middleware
// app.use(authMiddleware);

// // these are routers
// app.use("/api", expenseRouter);
// app.use("/api", userRouter);

// app.use("/api/ai", aiRouter);
// //error handle
// app.use(notFount);
// app.use(errorHandler);

// //root handle
// app.get("/", (req, resp) => {
//   console.log("this is my root url");
//   resp.json({
//     message: "Welcome to expense backend.",
//   });
// });

// //sever start
// app.listen(8081, () => {
//   console.log("Server started on port 8081");
// });
// server.js
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
    origin: "http://localhost:5173", // frontend port
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
