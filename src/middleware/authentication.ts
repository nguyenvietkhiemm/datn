import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JSON_TOKEN_KEY || "my_secret_key"; // bạn nên để trong .env

const Authentication = {
  // Middleware kiểm tra token
  AuthenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      (req as any).user = decoded;
      next();
    });
  },

  // Middleware kiểm tra vai trò
  AuthorizeRoles(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const user_role = (req as any).user?.role;

        if (!user_role) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        if (!roles.includes(user_role)) {
          return res
            .status(403)
            .json({ message: "Forbidden: Insufficient role" });
        }

        next();
      } catch (error) {
        return res.status(500).json({ message: "Server error", error });
      }
    };
  },
};

export default Authentication;
