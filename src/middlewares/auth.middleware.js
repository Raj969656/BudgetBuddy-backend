import jsonwebtoken from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return resp.status(403).json({
      message: "No access token found or invalid format!",
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jsonwebtoken.verify(token, ACCESS_SECRET);

    console.log("✅ Verified userId:", payload.sub || payload.id);
    req.userId = payload.sub || payload.id;

    next();
  } catch (e) {
    console.error("❌ Token verification failed:", e.message);
    resp.status(403).json({
      message: "Invalid or expired token!",
    });
  }
};
