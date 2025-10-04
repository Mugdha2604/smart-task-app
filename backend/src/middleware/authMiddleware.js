// // src/middleware/authMiddleware.js

import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (id, role, email)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};




// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import User from "../models/User.js";
// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

// export async function authenticate(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization || "";
//     const token = authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : null;
//     if (!token) return res.status(401).json({ error: "Token required" });

//     let decoded;
//     try {
//       decoded = jwt.verify(token, JWT_SECRET);
//     } catch (e) {
//       return res.status(401).json({ error: "Invalid token" });
//     }

//     // fetch user to attach refresh of role/name etc.
//     const user = await User.findByPk(decoded.id, {
//       attributes: ["id", "name", "email", "role"],
//     });
//     if (!user) return res.status(401).json({ error: "Invalid token" });

//     req.user = user; // attach user object
//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err);
//     return res.status(500).json({ error: "Authentication failed" });
//   }
// }
