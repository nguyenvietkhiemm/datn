import { query } from '../config/database';
import { Role } from '../model/role.model';
import { DefaultResponse } from '../utils/safe.excute';

const roleService = {
  async getAllRoles(): Promise<DefaultResponse<Role[]>> {
    const result = await query('SELECT * FROM role');
    if (result.rows.length === 0) {
      return { status: 404, message: 'Khong co role nao' };
    }
    return { status: 200, data: result.rows, message: 'Danh sach role' };
  },

  async getRoleById(id: number): Promise<DefaultResponse<Role | null>> {
    const result = await query('SELECT * FROM role WHERE role_id = $1', [id]);
    if (!result.rows[0]) {
      return { status: 404, message: 'Khong tim thay role' };
    }
    return { status: 200, data: result.rows[0], message: 'Role can tim' };
  },

  async createRole(role: Role): Promise<DefaultResponse<Role>> {
    const result = await query(
      'INSERT INTO role (role_id, role_name) VALUES ($1, $2) RETURNING *',
      [role.role_id, role.role_name]
    );
    return { status: 201, data: result.rows[0], message: 'Them role thanh cong' };
  },

  async updateRole(id: number, role: Partial<Role>): Promise<DefaultResponse<Role | null>> {
    const result = await query(
      'UPDATE role SET role_name = $1 WHERE role_id = $2 RETURNING *',
      [role.role_name, id]
    );
    if (!result.rows[0]) {
      return { status: 404, message: 'Khong tim thay role' };
    }
    return { status: 202, data: result.rows[0], message: 'Cap nhat role thanh cong' };
  },

  async deleteRole(id: number): Promise<DefaultResponse<null>> {
    const result = await query('DELETE FROM role WHERE role_id = $1', [id]);
    if (result.rowCount === 0) {
      return { status: 404, message: 'Khong tim thay role de xoa' };
    }
    return { status: 204, message: 'Xoa role thanh cong' };
  }
};

export default roleService;
