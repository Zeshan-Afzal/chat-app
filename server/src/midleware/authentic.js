import { verifyToken } from "../utils/utils.js";

export const authenticUser = (req, res, next) => {
  try {
     console.log(req.headers)
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authorization token missing or invalid" });
    }


    const user = verifyToken(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
