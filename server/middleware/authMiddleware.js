import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
  try {
    const cookieArr = req.get("cookie")?.split("=") || [];
    const cookie = cookieArr[cookieArr?.length - 1];
    const token =
      req.get("authorization") === "undefined"
        ? cookie
        : req.get("authorization");
    if (!token) {
      return res
        .status(401)
        .json({ errorMessage: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    console.error("[AuthMiddleware]", err.message);
    return res
      .status(401)
      .json({ errorMessage: "Unauthorized: Invalid token" });
  }
};
