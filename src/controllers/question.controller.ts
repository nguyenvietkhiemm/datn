import { Request, Response } from 'express';
import QuestionService from '../services/question.service';

const QuestionController = {
  // async get(req: Request, res: Response) {
  //   const questions = await QuestionService.get();
  //   res.json(questions);
  // },

  async getAll(req: Request, res: Response) {
    const questions = await QuestionService.getAll();
    res.json(questions);
  },

//   async getOne(req: Request, res: Response) {
//     const id = Number(req.params.id);
//     const role = await RoleService.getById(id);
//     if (!role) return res.status(404).json({ message: 'Role not found' });
//     res.json(role);
//   },

  async create(req: Request, res: Response) {
    const { questions } = req.body;
    console.log(questions);
    const created = await QuestionService.create(questions);
    res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const question = req.body;
    const updated = await QuestionService.update(id, question);
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.json(updated);
  },

  // async remove(req: Request, res: Response) {
  //   const id = Number(req.params.id);
  //   const success = await RoleService.remove(id);
  //   if (!success) return res.status(404).json({ message: 'Role not found' });
  //   res.status(204).send();
  // },
};

export default QuestionController;