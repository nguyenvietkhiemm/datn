"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const JWT_SECRET = process.env.JSON_TOKEN_KEY || "mysecret";
const Authentication = {
    // Middleware kiểm tra token
    async AuthenticateToken(req, res, next) {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
            if (!token) {
                return res.status(401).json({ message: "No token provided" });
            }
            // verify token (sẽ throw nếu invalid)
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            // tìm role_id theo user_id từ DB
            const result = await (0, database_1.query)(`SELECT user_id, email, role_id FROM "user" WHERE user_id = $1`, [decoded.user_id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: "User not found" });
            }
            // gắn user vào req
            req.user = result.rows[0];
            next();
        }
        catch (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
    },
    // Middleware kiểm tra vai trò
    AuthorizeRoles(roles) {
        return (req, res, next) => {
            try {
                const user_role = req.user?.role_id;
                console.log({ roles, user_role });
                if (!user_role) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                // ép kiểu đồng nhất
                if (!roles.map(r => String(r)).includes(String(user_role))) {
                    return res
                        .status(403)
                        .json({ message: "Forbidden: Insufficient role" });
                }
                next();
            }
            catch (error) {
                return res.status(500).json({ message: "Server error", error });
            }
        };
    },
};
exports.default = Authentication;
