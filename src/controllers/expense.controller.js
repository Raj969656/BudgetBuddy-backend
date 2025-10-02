// import Expense from "../models/expense.js";
// import User from "../models/users.js";
// import { parseDate, parsePrice } from "../utils/parseFilters.js";

// // let expenses = [
// //   {
// //     id: 1212,
// //     title: "Launch1",
// //     description: "This is luanch",
// //   },
// //   {
// //     id: 1341,
// //     title: "Launch2",
// //     description: "This is luanch",
// //   },
// // ];

// //get expenses
// export const getExpenses = async (req, resp) => {
//   //userid
//   const userId = req.userId;
//   if (!userId) {
//     return resp.status(403).json({
//       message: "invalid request",
//     });
//   }

//   const { minPrice, maxPrice, fromDate, toDate } = req.query;

//   let filter = {
//     hidden: false,
//     userId: userId,
//   };

//   // const fromDateParsed = parseDate(fromDate);
//   // const toDateParsed = parseDate(toDate);

//   if (minPrice && maxPrice) {
//     const minPriceParsed = parsePrice(minPrice);
//     const maxPriceParsed = parsePrice(maxPrice);
//     filter.rs = {
//       $gte: minPriceParsed,
//       $lte: maxPriceParsed,
//     };
//   }

//   if (minPrice && !maxPrice) {
//     const minPriceParsed = parsePrice(minPrice);
//     filter.rs = {
//       $gte: minPriceParsed,
//     };
//   }

//   if (maxPrice && !minPrice) {
//     const maxPriceParsed = parsePrice(maxPrice);
//     filter.rs = {
//       $lte: maxPriceParsed,
//     };
//   }

//   //getting the data from database
//   const exps = await Expense.find(filter).sort("-createdAt");
//   resp.status(200).json(exps);

//   // resp.json(expenses);
// };

// //get single expense
// export const getExpense = async (req, resp) => {
//   //   console.log("params");
//   //   console.log(req.params);
//   const { expenseId } = req.params;
//   //   console.log(expenseId);
//   // const ex = expenses.find((item) => item.id == expenseId);
//   // resp.json(ex);

//   const expense = await Expense.findOne({
//     _id: expenseId,
//   });

//   resp.status(200).json(expense);
// };

// //create expense
// export const createExpense = async (req, resp) => {
//   console.log(req.body);
//   console.log("exp controller  userid ", req.userId);

//   if (!req.userId) {
//     console.log("no user id found");
//     return resp.status(403).json({
//       message: "Invalid Request",
//     });
//   }
//   try {
//     const { title, description, rs, hidden, paymentMethod } = req.body;
//     // User exists or not
//     const user = await User.findById(req.userId);
//     if (!user) {
//       console.log("no user found");
//       return resp.status(404).json({
//         message: "User not found",
//       });
//     }
//     console.log("user found", user);
//     // validate data
//     console.log("validating data");
//     if (!title || !rs) {
//       console.log("title or rs missing");
//       return resp.status(400).json({
//         message: "Title and Amount are required",
//       });
//     }

//     console.log("data validated");

//     // rs must be a number and > 0
//     if (isNaN(rs) || rs <= 0) {
//       return resp.status(400).json({
//         message: "Amount must be a number and greater than 0",
//       });
//     }

//     // create an entry in db
//     console.log("creating expense");
//     const ob = await Expense.create({
//       title,
//       description,
//       paymentMethod,
//       rs,
//       hidden,
//       userId: req.userId,
//     });
//     console.log("expense created", ob);
//     resp.status(201).json(ob);
//   } catch (error) {
//     console.log("error in creating expense", error);
//     return resp.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// //delete expense
// export const deleteExpense = async (req, resp) => {
//   const { expenseId } = req.params;
//   // expenses = expenses.filter((ex) => ex.id != expenseId);
//   // resp.send("Expense Deleted");

//   await Expense.findByIdAndDelete(expenseId);
//   resp.json({
//     message: "Expense deleted !",
//   });
// };

// //update expense
// export const updateExpense = async (req, resp) => {
//   const { expId } = req.params;

//   const { title, description, rs, hidden, paymentMethod } = req.body;

//   // update to database
//   await Expense.updateOne(
//     {
//       _id: expId,
//     },
//     {
//       title,
//       description,
//       rs,
//       hidden,
//       paymentMethod,
//     }
//   );

//   const updatedExpense = await Expense.findOne({
//     _id: expId,
//   });

//   // const { title, description } = req.body;

//   // expenses = expenses.map((exp) => {
//   //   if (exp.id == expId) {
//   //     /// update fir return
//   //     exp.title = title;
//   //     exp.description = description;
//   //     return exp;
//   //   } else {
//   //     return exp;
//   //   }
//   // });

//   // resp.send("Expense updated ");

//   resp.status(200).json(updatedExpense);
// };

// //search by title
// export const searchByTitle = async (req, resp) => {
//   const { title } = req.query;
//   console.log(title);
//   // console.log(description);

//   const expenses = await Expense.find({
//     title: {
//       $regex: title,
//       $options: "i",
//     },
//   });

//   resp.send(expenses);
// };
// controllers/expense.controller.js
import Expense from "../models/expense.js";
import User from "../models/users.js";
import { parseDate, parsePrice } from "../utils/parseFilters.js";

// ===================== GET ALL EXPENSES =====================
export const getExpenses = async (req, resp) => {
  const userId = req.userId; // ✅ now works if middleware sets req.userId

  if (!userId) {
    return resp.status(403).json({ message: "Invalid request" });
  }

  const { minPrice, maxPrice, fromDate, toDate } = req.query;

  let filter = { hidden: false, userId };

  if (minPrice && maxPrice) {
    filter.rs = {
      $gte: parsePrice(minPrice),
      $lte: parsePrice(maxPrice),
    };
  } else if (minPrice) {
    filter.rs = { $gte: parsePrice(minPrice) };
  } else if (maxPrice) {
    filter.rs = { $lte: parsePrice(maxPrice) };
  }

  // date filters (optional)
  // if (fromDate && toDate) {
  //   filter.createdAt = { $gte: parseDate(fromDate), $lte: parseDate(toDate) };
  // }

  try {
    const exps = await Expense.find(filter).sort("-createdAt");
    resp.status(200).json(exps);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};

// ===================== GET SINGLE EXPENSE =====================
export const getExpense = async (req, resp) => {
  const { expenseId } = req.params;

  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return resp.status(404).json({ message: "Expense not found" });
    }
    resp.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching single expense:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};

// ===================== CREATE EXPENSE =====================
export const createExpense = async (req, resp) => {
  console.log("Incoming expense body:", req.body);
  console.log("Authenticated userId:", req.userId);

  if (!req.userId) {
    return resp.status(403).json({ message: "Invalid Request - No User ID" });
  }

  try {
    const { title, description, rs, hidden, paymentMethod } = req.body;

    // validate user exists
    const user = await User.findById(req.userId);
    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }

    // validation
    if (!title || !rs) {
      return resp.status(400).json({ message: "Title and Amount are required" });
    }
    if (isNaN(rs) || rs <= 0) {
      return resp
        .status(400)
        .json({ message: "Amount must be a number and greater than 0" });
    }

    // create entry
    const expense = await Expense.create({
      title,
      description,
      paymentMethod,
      rs,
      hidden,
      userId: req.userId,
    });

    resp.status(201).json(expense);
  } catch (error) {
    console.error("Error in creating expense:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};

// ===================== DELETE EXPENSE =====================
export const deleteExpense = async (req, resp) => {
  const { expenseId } = req.params;

  try {
    const deleted = await Expense.findByIdAndDelete(expenseId);
    if (!deleted) {
      return resp.status(404).json({ message: "Expense not found" });
    }
    resp.json({ message: "Expense deleted!" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};

// ===================== UPDATE EXPENSE =====================
export const updateExpense = async (req, resp) => {
  const { expId } = req.params;
  const { title, description, rs, hidden, paymentMethod } = req.body;

  try {
    await Expense.updateOne(
      { _id: expId },
      { title, description, rs, hidden, paymentMethod }
    );

    const updatedExpense = await Expense.findById(expId);

    if (!updatedExpense) {
      return resp.status(404).json({ message: "Expense not found" });
    }

    resp.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};

// ===================== SEARCH EXPENSE =====================
export const searchByTitle = async (req, resp) => {
  const { title } = req.query;

  try {
    const expenses = await Expense.find({
      title: { $regex: title, $options: "i" },
    });
    resp.status(200).json(expenses);
  } catch (error) {
    console.error("Error searching expenses:", error);
    resp.status(500).json({ message: "Internal server error" });
  }
};
