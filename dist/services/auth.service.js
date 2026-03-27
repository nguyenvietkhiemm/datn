"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const create_token_1 = __importDefault(require("../utils/create.token"));
const AuthService = {
    async register(user_name, password, email, birthday) {
        // kiểm tra email tồn tại
        const checkUser = await (0, database_1.query)(`SELECT * FROM "user" WHERE email = $1`, [email]);
        if (checkUser.rows.length > 0) {
            throw new Error("EMAIL_EXISTS");
        }
        // hash password
        const hashPassword = await bcrypt_1.default.hash(password, 10);
        // tạo user mới
        const result = await (0, database_1.query)(`INSERT INTO "user" (user_name, email, password_hash, birthday)
       VALUES ($1, $2, $3, $4) RETURNING *`, [user_name, email, hashPassword, birthday]);
        const newUser = result.rows[0];
        const { password_hash, user_id, role_id, ...safeUser } = newUser;
        // tạo token
        const token = (0, create_token_1.default)(newUser.user_id, newUser.email);
        return { user: safeUser, token };
    },
    async login(email, password) {
        const userResult = await (0, database_1.query)(`SELECT * FROM "user" WHERE email = $1`, [email]);
        if (userResult.rows.length === 0) {
            throw new Error("USER_NOT_FOUND");
        }
        const foundUser = userResult.rows[0];
        // kiểm tra password
        const isMatch = await bcrypt_1.default.compare(password, foundUser.password_hash);
        if (!isMatch) {
            throw new Error("INVALID_PASSWORD");
        }
        // tạo token
        const token = (0, create_token_1.default)(foundUser.user_id, foundUser.email);
        // loại bỏ password_hash trước khi trả về
        const { password_hash, user_id, role_id, ...safeUser } = foundUser;
        return { user: safeUser, token };
    },
};
exports.default = AuthService;
