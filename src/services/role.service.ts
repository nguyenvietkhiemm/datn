import { query } from '../config/database';
import { Role } from '../model/role.model';

export const getAllRoles = async (): Promise<Role[]> => {
  const result = await query('SELECT * FROM role');
  return result.rows;
};

export const getRoleById = async (id: number): Promise<Role | null> => {
  const result = await query('SELECT * FROM role WHERE role_id = $1', [id]);
  return result.rows[0] || null;
};

export const createRole = async (role: Role): Promise<Role> => {
  const result = await query(
    'INSERT INTO role (role_id, role_name) VALUES ($1, $2) RETURNING *',
    [role.role_id, role.role_name]
  );
  return result.rows[0];
};

export const updateRole = async (id: number, role: Partial<Role>): Promise<Role | null> => {
  const result = await query(
    'UPDATE role SET role_name = $1 WHERE role_id = $2 RETURNING *',
    [role.role_name, id]
  );
  return result.rows[0] || null;
};

export const deleteRole = async (id: number): Promise<boolean> => {
  const result = await query('DELETE FROM role WHERE role_id = $1', [id]);
  return result.rowCount! > 0;
};
