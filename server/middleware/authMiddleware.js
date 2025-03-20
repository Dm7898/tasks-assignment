import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  console.log(token);
  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET_KEY
    );
    // console.log(decoded);
    req.user = await User.findById(decoded.userId).select("-password");
    // console.log("User Found:", req.user); // Exclude password
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
