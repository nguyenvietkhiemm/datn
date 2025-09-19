import { query } from "../config/database";
import { User } from "../model/user.model";
import { DefaultResponse } from "../utils/safe.excute";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

const createToken = (user_id: number, role_id: number) => {
    return jwt.sign(
        { user_id, role_id },
        JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const AuthService = {
    async regist(
        user_name: string,
        password: string,
        email: string,
        birthday: Date,
        role_id: number
    ): Promise<DefaultResponse<{ email: string; user_name : string; token: string }>> {
        // kiểm tra email tồn tại chưa
        const check_user = await query(`SELECT * FROM "user" WHERE email = $1`, [email]);
        if (check_user.rows.length > 0) {
            return { status: 400, message: "Email đã tồn tại. Vui lòng chọn email khác!" };
        }

        // hash password
        const hash_password = await bcrypt.hash(password, 10);

        // tạo user mới
        const result = await query(
            `INSERT INTO "user" (user_name, email, password_hash, birthday, created_at, role_id) 
       VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING *`,
            [user_name, email, hash_password, birthday, role_id || 1]
        );

        const newUser: User = result.rows[0];

        // tạo token
        const token = createToken(newUser.user_id, newUser.role_id);

        return {
            status: 201,
            message: "Đăng ký thành công",
            data: { user_name, email, token }
        };
    },

    async login(
        email: string,
        password: string
      ): Promise<DefaultResponse<{ user: User; token: string }>> {
        const user = await query(`SELECT * FROM "user" WHERE email = $1`, [email]);
      
        if (user.rows.length === 0) {
          return { status: 404, message: "Không tìm thấy người dùng" };
        }
      
        const foundUser: User = user.rows[0];
      
        // kiểm tra password
        const isMatch = await bcrypt.compare(password, foundUser.password_hash);
        if (!isMatch) {
          return { status: 401, message: "Mật khẩu không đúng" };
        }
      
        // tạo token
        const token = createToken(foundUser.user_id, foundUser.role_id);
      
        // loại bỏ password_hash trước khi trả về
        const { password_hash, ...safeUser } = foundUser;
      
        return {
          status: 200,
          message: "Đăng nhập thành công",
          data: { user: safeUser as User, token }
        };
      }      
};

export default AuthService;
