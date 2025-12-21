import { Request, Response } from 'express';
import QuestionService from '../services/question.service';
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import path from "path";
import fs from "fs";
import { parseQuestionsFromCSV } from '../utils/parse.csv';
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const QuestionController = {

  async removeVietnameseTones(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  },
  
  async getAll(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      const page = Number(req.query.page) || 1;
  
      const status =
        typeof req.query.available === "string"
          ? req.query.available
          : "All";
  
      const searchValue =
        typeof req.query.keyword === "string"
          ? req.query.keyword
          : "";
  
      const type_question = Number(req.query.type_question)
  
      return {
        status: 200,
        message: "Lấy danh sách câu hỏi thành công",
        data: await QuestionService.getAll(
          page,
          status,
          searchValue,
          type_question
        ),
      } as DefaultResponse<any>;
    });
  
    res.status(response.status).json(response);
  },

  async create(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      const  payload  = req.body;
      
      const created = await QuestionService.create(payload);

      return {
        status: 201,
        message: "Tạo câu hỏi thành công",
        data: created
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async update(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Cập nhật câu hỏi thành công",
        data: await QuestionService.update(Number(req.params.id), req.body)
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async setAvailable(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 202,
        message: "Đổi trạng thái câu hỏi thành công",
        data: await QuestionService.setAvailable(parseInt(req.params.id, 10), Boolean(req.body.available))
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async remove(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      return {
        status: 204,
        message: "Xoá câu hỏi thành công",
        data: await QuestionService.remove(parseInt(req.params.id, 10))
      } as DefaultResponse<any>;
    });

    res.status(response.status).json(response);
  },

  async uploadQuestionImages (req: Request, res: Response) {
    try {
      // multer đã xử lý upload trước đó
      if (!req.files || !(req.files instanceof Array)) {
        return res.status(400).json({
          message: "No images uploaded",
        });
      }
  
      const files = req.files as Express.Multer.File[];
  
      // Tạo link public cho FE
      const imageLinks = files.map(
        (file) => `/resources/images/questions/${file.filename}`
      );
  
      return res.json(imageLinks);
    } catch (error) {
      console.error("Upload question images error:", error);
      return res.status(500).json({
        message: "Upload question images failed",
      });
    }
  },

  async uploadAnswerImages (req: Request, res: Response) {
    try {
      // multer đã xử lý upload trước đó
      if (!req.files || !(req.files instanceof Array)) {
        return res.status(400).json({
          message: "No images uploaded",
        });
      }
  
      const files = req.files as Express.Multer.File[];
  
      // Tạo link public cho FE
      const imageLinks = files.map(
        (file) => `/resources/images/answers/${file.filename}`
      );
  
      return res.json(imageLinks);
    } catch (error) {
      console.error("Upload question images error:", error);
      return res.status(500).json({
        message: "Upload question images failed",
      });
    }
  }
};

export default QuestionController;