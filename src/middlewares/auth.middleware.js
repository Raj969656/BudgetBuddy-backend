import jsonwebtoken from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return resp.status(403).json({
      message: "no acccess token found!!",
    });
  }

  try {
    const payload = jsonwebtoken.verify(authorization, ACCESS_SECRET);

    console.log("userid", payload.sub);
    req.userId = payload.sub;

    next();
  } catch (e) {
    resp.status(403).json({
      message: e.message,
    });
  }
};
//logic
// token ko nikalenge
// token ko kaise verify
// agar varify ho gya
// to ham next() access
//otherwise --> error return
