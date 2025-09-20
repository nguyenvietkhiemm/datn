import { Request, Response } from 'express';
import QuestionService from '../services/question.service';
import safeExecute, { DefaultResponse } from "../utils/safe.execute";

const QuestionController = {
  // async get(req: Request, res: Response) {
  //   const questions = await QuestionService.get();
  //   res.json(questions);
  // },

  async getAll(req: Request, res: Response) {
    const responses: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 200,
        message: "Lấy danh sách câu hỏi thành công",
        data: await QuestionService.getAll()
      } as DefaultResponse<any>;
    });

    res.json(responses);
  },

  async create(req: Request, res: Response) {
    const responses: DefaultResponse<any> = await safeExecute(async () => {
      const { questions } = req.body;
      const created = await QuestionService.create(questions);

      return {
        status: 201,
        message: "Tạo câu hỏi thành công",
        data: created
      } as DefaultResponse<any>;
    });

    res.json(responses);
  },

  async update(req: Request, res: Response) {
    const responses: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Cập nhật câu hỏi thành công",
        data: await QuestionService.update(req.body)
      } as DefaultResponse<any>;
    });

    res.json(responses);
  },

  async setAvailable(req: Request, res: Response) {
    console.log(req.body);
    const responses: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Đổi trạng thái câu hỏi thành công",
        data: await QuestionService.setAvailable(parseInt(req.params.question_id, 10), Boolean(req.body.available))
      } as DefaultResponse<any>;
    });

    res.json(responses);
  },

  async remove(req: Request, res: Response) {
    const responses: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 204,
        message: "Xoá câu hỏi thành công",
        data: await QuestionService.remove(parseInt(req.params.question_id, 10))
      } as DefaultResponse<any>;
    });

    res.json(responses);
  },
};

export default QuestionController;