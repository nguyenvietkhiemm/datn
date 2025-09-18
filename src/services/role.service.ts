import { query } from '../config/database';
import { Role } from '../model/role.model';

export interface roleResponse {
  status: number;
  data?: Role[] | Role | null;
  message: string;
  error?: string;
}

export const getAllRoles = async (): Promise<roleResponse> => {
  const result = await query('SELECT * FROM role');
  return { status: 200, data: result.rows, message: 'Danh sach role' };
};

export const getRoleById = async (id: number): Promise<roleResponse> => {
  const result = await query('SELECT * FROM role WHERE role_id = $1', [id]);
  if (!result.rows[0]) {
    return { status: 404, message: 'Khong tim thay role' };
  }
  return { status: 200, data: result.rows[0] || null, message: 'Role can tim' };
};

export const createRole = async (role: Role): Promise<roleResponse> => {
  const result = await query(
    'INSERT INTO role (role_id, role_name) VALUES ($1, $2) RETURNING *',
    [role.role_id, role.role_name]
  );
  return { status: 201, data: result.rows[0], message: 'Them role thanh cong' };
};

export const updateRole = async (
  id: number,
  role: Partial<Role>
): Promise<roleResponse> => {
  const result = await query(
    'UPDATE role SET role_name = $1 WHERE role_id = $2 RETURNING *',
    [role.role_name, id]
  );
  if (!result.rows[0]) {
    return { status: 404, message: 'Khong tim thay role' };
  }
  return {
    status: 202,
    data: result.rows[0],
    message: 'Cap nhat role thanh cong',
  };
};

export const deleteRole = async (id: number): Promise<roleResponse> => {
  await query('DELETE FROM role WHERE role_id = $1', [id]);
  return { status: 204, message: 'Xoa role thanh cong' };
};
