import { Request, Response } from 'express';
import * as roleService from '../services/role.service';
import safeExcute from '../utils/safe.excute';

export const getAll = async (req: Request, res: Response) => {
  res.json(await safeExcute(() => roleService.getAllRoles()));
};

export const getOne = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  res.json(await safeExcute(() => roleService.getRoleById(id)))
};

export const create = async (req: Request, res: Response) => {
  const role = req.body;
  res.json(await safeExcute(() => roleService.createRole(role)))
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  res.json(await safeExcute(() => roleService.updateRole(id, req.body)));
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  res.json(await safeExcute(() => roleService.deleteRole(id)));
};
