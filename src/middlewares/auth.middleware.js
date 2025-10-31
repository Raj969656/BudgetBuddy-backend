import jsonwebtoken from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({
      message: "no acccess token found!!",
    });
  }

  try {
    const payload = jsonwebtoken.verify(authorization, ACCESS_SECRET);
    req.userId = payload.sub || payload.id; // ✅ handle both key names
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};
