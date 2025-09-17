import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DATABASE_USER || 'postgres',
  host: process.env.DATABASE_HOST || '192.168.23.5',
  database: process.env.DATABASE_NAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '12345',
  port: Number(process.env.DATABASE_PORT) || 5432,
});

// Hàm query chung, bạn có thể dùng để query DB
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
