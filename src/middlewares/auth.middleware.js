import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../utils/constants.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Token header check
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No access token found" });
  }

  const token = authHeader.split(" ")[1]; // ✅ Extract token only
  try {
    // ✅ Verify token properly
    const decoded = jwt.verify(token, ACCESS_SECRET);
    console.log("✅ Verified user id:", decoded.sub);

    // ✅ Attach decoded user to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
