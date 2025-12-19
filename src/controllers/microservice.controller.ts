import { Request, Response } from 'express';
import safeExecute, { DefaultResponse } from '../utils/safe.execute';
import axios from 'axios';

const PYTHON_LLM_URL = 'http://localhost:8000/llm/ask';

const MicroserviceController = {
  async askLLM(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      const { question } = req.body;

      if (!question || typeof question !== 'string') {
        return {
          status: 400,
          message: 'question is required',
          data: null,
        };
      }

      // call Python FastAPI
      const llmRes = await axios.post(PYTHON_LLM_URL, {
        question,
      });

      return {
        status: 200,
        message: 'LLM answer',
        data: llmRes.data, // { question, answer, sources }
      };
    });

    res.status(response.status).json(response);
  },
};

export default MicroserviceController;
