import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: Number(process.env.DATABASE_PORT),
});

// test kết nối + tạo admin mặc định
(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Kết nối thành công, thời gian DB:", res.rows[0]);

    // kiểm tra role ADMIN đã có chưa
    const roleCheck = await pool.query(
      `SELECT * FROM role WHERE role_name = 'admin'`
    );
    let adminRoleId: number;

    if (roleCheck.rows.length === 0) {
      const newRole = await pool.query(
        `INSERT INTO role (role_name) VALUES ('admin') RETURNING role_id`
      );
      adminRoleId = newRole.rows[0].role_id;
      console.log("Đã tạo role admin với id:", adminRoleId);
    } else {
      adminRoleId = roleCheck.rows[0].role_id;
    }

    // kiểm tra admin user
    const userCheck = await pool.query(
      `SELECT * FROM "user" WHERE email = $1`,
      ["admin@example.com"]
    );

    if (userCheck.rows.length === 0) {
      const hash = await bcrypt.hash("admin123", 10);
      await pool.query(
        `INSERT INTO "user" (user_name, email, password_hash, birthday, role_id, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        ["admin", "admin@example.com", hash, "1990-01-01", adminRoleId]
      );
      console.log(
        "Tài khoản ADMIN đã được tạo (email: admin@example.com, pass: admin123)"
      );
    } else {
      console.log("Tài khoản ADMIN đã tồn tại");
    }
  } catch (err) {
    console.error("❌ Lỗi kết nối:", err);
    console.log("DB CONFIG:", {
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
    });
  }
})();

// Hàm query chung
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
