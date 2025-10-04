"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const RoleService = {
    async getAll() {
        const result = await (0, database_1.query)('SELECT * FROM role ORDER BY role_id');
        return result.rows;
    },
    async getById(id) {
        const result = await (0, database_1.query)('SELECT * FROM role WHERE role_id = $1', [id]);
        if (!result.rows[0]) {
            throw new Error('ROLE_NOT_FOUND');
        }
        return result.rows[0];
    },
    async create(role) {
        // kiểm tra role đã tồn tại
        const check = await (0, database_1.query)('SELECT * FROM role WHERE role_name = $1', [role.role_name]);
        if (check.rows.length > 0) {
            throw new Error('ROLE_EXISTS');
        }
        // thêm mới
        const result = await (0, database_1.query)('INSERT INTO role (role_name) VALUES ($1) RETURNING *', [role.role_name]);
        return result.rows[0];
    },
    async update(id, role) {
        const result = await (0, database_1.query)('UPDATE role SET role_name = COALESCE($1, role_name) WHERE role_id = $2 RETURNING *', [role.role_name, id]);
        if (!result.rows[0]) {
            throw new Error('ROLE_NOT_FOUND');
        }
        return result.rows[0];
    },
    async remove(id) {
        const result = await (0, database_1.query)('DELETE FROM role WHERE role_id = $1', [id]);
        if (result.rowCount === 0) {
            throw new Error('ROLE_NOT_FOUND');
        }
    },
};
exports.default = RoleService;
