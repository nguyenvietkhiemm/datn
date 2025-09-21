import { query } from '../config/database';
import { User } from '../model/user.model';

const UserService = {
    // Lấy toàn bộ user
    async getAll(): Promise<User[]> {
        const result = await query('SELECT * FROM "user" WHERE role_id = 1 ORDER BY user_id');
        return result.rows as User[];
    },

    // Lấy user theo ID
    async getById(id: number): Promise<User> {
        const result = await query('SELECT * FROM "user" WHERE user_id = $1', [id]);
        if (!result.rows[0]) throw new Error('USER_NOT_FOUND');
        return result.rows[0] as User;
    },

    // Cập nhật user
    async update(id: number, user: Partial<Omit<User, 'user_id' | 'created_at'>>): Promise<User> {
        const result = await query(
            `UPDATE "user" 
            SET user_name = COALESCE($1, user_name),
             email = COALESCE($2, email),
             password_hash = COALESCE($3, password_hash),
             birthday = COALESCE($4, birthday),
             role_id = COALESCE($5, role_id)
            WHERE user_id = $6
            RETURNING *`,
            [user.user_name, user.email, user.password_hash, user.birthday, user.role_id, id]
        );
        if (!result.rows[0]) throw new Error('USER_NOT_FOUND');
        return result.rows[0] as User;
    },

    // Xóa user
    async remove(id: number): Promise<void> {
        const result = await query('DELETE FROM "user" WHERE user_id = $1', [id]);
        if (result.rowCount === 0) throw new Error('USER_NOT_FOUND');
    },
};

export default UserService;
