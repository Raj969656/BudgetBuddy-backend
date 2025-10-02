import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  searchByTitle,
  updateExpense,
} from "../controllers/expense.controller.js";

const expenseRouter = Router();

//get single expense
// get all expenses
expenseRouter.get("/expenses", getExpenses);
//search
expenseRouter.get("/expenses/search", searchByTitle);
expenseRouter.get("/expenses/:expenseId", getExpense);
// create expese
expenseRouter.post("/expenses", createExpense);
expenseRouter.delete("/expenses/:expenseId", deleteExpense); // updating expense
expenseRouter.put("/expenses/:expId", updateExpense);

export default expenseRouter;
