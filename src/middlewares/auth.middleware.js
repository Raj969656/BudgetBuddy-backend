import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

dotenv.config();

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  // 🧩 Check if Authorization header is present and valid
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(403).json({
      message: "No access token found or invalid format!",
    });
  }

  // Extract token (remove "Bearer ")
  const token = authorization.split(" ")[1];

  try {
    // ✅ Verify token using the SAME secret used during login
    const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET || "secretkey");

    console.log("✅ Verified userId:", payload.id);
    req.userId = payload.id;

    // Move to next middleware/route
    next();
  } catch (e) {
    console.error("❌ Token verification failed:", e.message);
    res.status(403).json({
      message: "Invalid or expired token!",
    });
  }
};
