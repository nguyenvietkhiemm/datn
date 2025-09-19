import { Request, Response } from 'express';
import roleService from '../services/role.service';
import safeExcute from '../utils/safe.excute';

const roleController = {
  async getAll(req: Request, res: Response) {
    const result = await safeExcute(() => roleService.getAllRoles());
    res.status(result.status).json(result);
  },

  async getOne(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await safeExcute(() => roleService.getRoleById(id));
    res.status(result.status).json(result);
  },

  async create(req: Request, res: Response) {
    const role = req.body;
    const result = await safeExcute(() => roleService.createRole(role));
    res.status(result.status).json(result);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await safeExcute(() => roleService.updateRole(id, req.body));
    res.status(result.status).json(result);
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await safeExcute(() => roleService.deleteRole(id));
    res.status(result.status).json(result);
  }
};

export default roleController;
