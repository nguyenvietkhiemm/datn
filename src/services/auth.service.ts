import { query } from "../config/database";
import { User } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JSON_TOKEN_KEY || "mysecret";

const createToken = (user_id: number, role_id: number) => {
  return jwt.sign({ user_id, role_id }, JWT_SECRET, { expiresIn: "1h" });
};

const AuthService = {
  async regist(
    user_name: string,
    password: string,
    email: string,
    birthday: Date,
    role_id: number
  ): Promise<{ user: User; token: string }> {
    // kiểm tra email tồn tại
    const checkUser = await query(`SELECT * FROM "user" WHERE email = $1`, [email]);
    if (checkUser.rows.length > 0) {
      throw new Error("EMAIL_EXISTS");
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // tạo user mới
    const result = await query(
      `INSERT INTO "user" (user_name, email, password_hash, birthday, created_at, role_id)
       VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *`,
      [user_name, email, hashPassword, birthday, role_id]
    );

    const newUser: User = result.rows[0];
    const { password_hash, ...safeUser } = newUser;

    // tạo token
    const token = createToken(newUser.user_id, newUser.role_id);

    return { user: safeUser as User, token };
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const userResult = await query(`SELECT * FROM "user" WHERE email = $1`, [email]);

    if (userResult.rows.length === 0) {
      throw new Error("USER_NOT_FOUND");
    }

    const foundUser: User = userResult.rows[0];

    // kiểm tra password
    const isMatch = await bcrypt.compare(password, foundUser.password_hash);
    if (!isMatch) {
      throw new Error("INVALID_PASSWORD");
    }

    // tạo token
    const token = createToken(foundUser.user_id, foundUser.role_id);

    // loại bỏ password_hash trước khi trả về
    const { password_hash, ...safeUser } = foundUser;

    return { user: safeUser as User, token };
  },
};

export default AuthService;
