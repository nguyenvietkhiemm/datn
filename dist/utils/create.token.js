"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CreateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JSON_TOKEN_KEY || "mysecret";
function CreateToken(user_id, email) {
    return jsonwebtoken_1.default.sign({ user_id, email }, JWT_SECRET, { expiresIn: "1h" });
}
;
