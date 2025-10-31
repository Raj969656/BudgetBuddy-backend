import jsonwebtoken from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(403).json({
      message: "no access token found!!",
    });
  }

  try {
    // ✅ Strip "Bearer " if present
    const token = authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : authorization;

    const payload = jsonwebtoken.verify(token, ACCESS_SECRET);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(403).json({
      message: "invalid or expired token",
      error: e.message,
    });
  }
};
