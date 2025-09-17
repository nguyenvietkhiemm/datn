import { Request, Response } from 'express';
import * as roleService from '../services/role.service';

export const getAll = async (req: Request, res: Response) => {
  const roles = await roleService.getAllRoles();
  res.json(roles);
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const role = await roleService.getRoleById(id);
  if (!role) return res.status(404).json({ message: 'Role not found' });
  res.json(role);
};

export const create = async (req: Request, res: Response) => {
  const role = req.body;
  const created = await roleService.createRole(role);
  res.status(201).json(created);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const updated = await roleService.updateRole(id, req.body);
  if (!updated) return res.status(404).json({ message: 'Role not found' });
  res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const success = await roleService.deleteRole(id);
  if (!success) return res.status(404).json({ message: 'Role not found' });
  res.status(204).send();
};
