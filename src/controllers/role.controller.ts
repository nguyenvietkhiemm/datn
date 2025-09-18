import { Request, Response } from 'express';
import RoleService from '../services/role.service';

const RoleController = {
  async getAll(req: Request, res: Response) {
    const roles = await RoleService.getAll();
    res.json(roles);
  },

  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    const role = await RoleService.getById(id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  },

  async create(req: Request, res: Response) {
    const created = await RoleService.create(req.body);
    res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await RoleService.update(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Role not found' });
    res.json(updated);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const success = await RoleService.remove(id);
    if (!success) return res.status(404).json({ message: 'Role not found' });
    res.status(204).send();
  },
};

export default RoleController;