process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});


import mongoose from "mongoose";
import { mongoURI } from "../utils/constants.js";
// mongoose
//   .connect(mongoURI)
//   .then(() => {
//     console.log("db is connected");
//   })
//   .catch((error) => {
//     console.log(error);
//     console.log("error in connecting with db");
//   });

async function connectDb() {
  try {
    await mongoose.connect(mongoURI);
    console.log("connected to db");
  } catch (e) {
    console.log(e);
    console.log("error in connecting db");
  }
}

connectDb();

export default connectDb;
