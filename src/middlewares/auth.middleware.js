import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({
      message: "no access token found!!",
    });
  }

  try {
    const payload = jwt.verify(authorization, ACCESS_SECRET);
    req.userId = payload.id || payload.sub;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};
