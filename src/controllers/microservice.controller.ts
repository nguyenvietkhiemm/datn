import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import axios from "axios";
import path from "path";
import fs from "fs";

const PYTHON_LLM_URL = "http://localhost:8000/llm/ask";
const VECTORIZE_URL = "http://localhost:8000/llm/vectorize";

const MicroserviceController = {
  async askLLM(req: Request, res: Response) {
    const response: DefaultResponse<any> = await safeExecute(async () => {
      const { question } = req.body;

      if (!question || typeof question !== "string") {
        return {
          status: 400,
          message: "question is required",
          data: null,
        };
      }

      const llmRes = await axios.post(PYTHON_LLM_URL, { question });

      return {
        status: 200,
        message: "LLM answer",
        data: llmRes.data, // { question, answer, sources }
      };
    });

    res.status(response.status).json(response);
  },

  async vectorize(req: Request, res: Response) {
    const response = await safeExecute(async () => {
      const { file_paths } = req.body;

      if (!Array.isArray(file_paths) || file_paths.length === 0) {
        return {
          status: 400,
          message: "file_paths must be a non-empty array",
          data: null,
        };
      }

      // 📌 root thư mục project
      const BASE_DIR = path.resolve(__dirname, "../../");

      // ✅ chuẩn hoá + validate tồn tại
      const absolutePaths = file_paths.map((relativePath: string) => {
        const absPath = path.join(BASE_DIR, relativePath);
        if (!fs.existsSync(absPath)) throw new Error(`File not found: ${relativePath}`);
        return absPath.replace(/\\/g, "/"); // dùng slash chuẩn
      });


      console.log("Vectorizing files:", absolutePaths);

      // 👉 gửi sang Python
      await axios.post(VECTORIZE_URL, { file_paths: absolutePaths }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      return {
        status: 200,
        message: "Vectorize started",
        data: {
          total_files: absolutePaths.length,
        },
      };
    });

    res.status(response.status).json(response);
  },

};

export default MicroserviceController;
