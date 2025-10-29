"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const UserService = {
    // Lấy toàn bộ user
    async getAll() {
        const result = await (0, database_1.query)(`
        SELECT user_id, user_name, email, birthday, created_at, role_id, available
        FROM "user"
        ORDER BY user_id
        `);
        return result.rows;
    },
    // Lấy user theo ID
    async getById(id) {
        const result = await (0, database_1.query)(`
        SELECT user_id, user_name, email, birthday, created_at, role_id, available
        FROM "user"
        WHERE user_id = $1`, [id]);
        if (!result.rows[0])
            throw new Error('USER_NOT_FOUND');
        return result.rows[0];
    },
    // Cập nhật user
    async update(id, user) {
        const result = await (0, database_1.query)(`UPDATE "user" 
            SET user_name = COALESCE($1, user_name),
             email = COALESCE($2, email),
             password_hash = COALESCE($3, password_hash),
             birthday = COALESCE($4, birthday),
             role_id = COALESCE($5, role_id)
            WHERE user_id = $6
            RETURNING user_id, user_name, email, birthday, created_at, available`, [user.user_name, user.email, user.password_hash, user.birthday, user.role_id, id]);
        if (!result.rows[0])
            throw new Error('USER_NOT_FOUND');
        return result.rows[0];
    },
    // Xóa user
    async remove(id) {
        const result = await (0, database_1.query)('DELETE FROM "user" WHERE user_id = $1', [id]);
        if (result.rowCount === 0)
            throw new Error('USER_NOT_FOUND');
    },
};
exports.default = UserService;
