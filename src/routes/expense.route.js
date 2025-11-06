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

// get all expenses
expenseRouter.get("/", getExpenses);
// search expenses
expenseRouter.get("/search", searchByTitle);
// get single expense
expenseRouter.get("/:expenseId", getExpense);
// create expense
expenseRouter.post("/", createExpense);
// delete expense
expenseRouter.delete("/:expenseId", deleteExpense);
// update expense
expenseRouter.put("/:expId", updateExpense);

export default expenseRouter;
