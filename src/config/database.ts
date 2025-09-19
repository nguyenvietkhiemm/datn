import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DATABASE_USER || 'postgres',
  host: process.env.DATABASE_HOST || '192.168.23.5',
  database: process.env.DATABASE_NAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '12345',
  port: Number(process.env.DATABASE_PORT) || 5432,
});

// test kết nối
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(' Kết nối thành công, thời gian DB:', res.rows[0]);
  } catch (err) {
    console.error(' Lỗi kết nối:', err);
  }
})();

// Hàm query chung
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
