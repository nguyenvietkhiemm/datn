import { query } from '../config/database';
import { User } from '../model/user.model';

const UserService = {
//   async getAll(): Promise<User[]> {
//     const result = await query('SELECT * FROM user');
//     return result.rows;
//   },

//   async getById(id: number): Promise<User | null> {
//     const result = await query('SELECT * FROM user WHERE role_id = $1', [id]);
//     return result.rows[0] || null;
//   },

//   async create(user: User): Promise<User> {
//     const result = await query(
//       'INSERT INTO user (role_id, role_name) VALUES ($1, $2) RETURNING *',
//       [user.role_id, user.role_name]
//     );
//     return result.rows[0];
//   },

//   async update(id: number, user: Partial<User>): Promise<User | null> {
//     const result = await query(
//       'UPDATE user SET role_name = $1 WHERE role_id = $2 RETURNING *',
//       [user.role_name, id]
//     );
//     return result.rows[0] || null;
//   },

//   async remove(id: number): Promise<boolean> {
//     const result = await query('DELETE FROM user WHERE role_id = $1', [id]);
//     return result.rowCount! > 0;
//   },
};

export default UserService;