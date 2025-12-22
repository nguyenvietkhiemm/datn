import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import axios from "axios";
import path from "path";
import fs from "fs";
import FormData from "form-data";
import AdmZip from "adm-zip";


const PYTHON_LLM_URL = "http://localhost:8000/llm/ask";
const VECTORIZE_URL = "http://localhost:8000/llm/vectorize";
const DOCX_PROCESS_URL = "http://localhost:8000/bert/process-docx";

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

  // ===== DOCX =====
  async process_docx(req: Request, res: Response) {
    const result = await safeExecute(async () => {
      if (!req.file) throw new Error("NO_DOCX_FILE");

      // =====================
      // 1. Gửi file sang Python
      // =====================
      const form = new FormData();
      form.append("file", fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const pyRes = await axios.post(
        DOCX_PROCESS_URL,
        form,
        {
          headers: form.getHeaders(),
          responseType: "arraybuffer", // ZIP
          maxBodyLength: Infinity,
        }
      );

      // =====================
      // 2. Lưu zip tạm
      // =====================
      const tmpZipPath = req.file.path.replace(/\.docx$/i, "_result.zip");
      fs.writeFileSync(tmpZipPath, pyRes.data);

      // =====================
      // 3. Chuẩn bị output dirs
      // =====================
      const BASE_OUTPUT = path.resolve(__dirname, "../../data/outputs");
      const MEDIA_DIR = path.join(BASE_OUTPUT, "media");

      fs.mkdirSync(BASE_OUTPUT, { recursive: true });
      fs.mkdirSync(MEDIA_DIR, { recursive: true });

      // =====================
      // 4. Unzip + phân loại
      // =====================
      const zip = new AdmZip(tmpZipPath);
      const entries = zip.getEntries();

      for (const entry of entries) {
        if (entry.isDirectory) continue;

        // 📄 JSON
        if (entry.entryName.endsWith(".json")) {
          const jsonPath = path.join(BASE_OUTPUT, entry.entryName);
          fs.writeFileSync(jsonPath, entry.getData());
        }

        // 🖼️ IMAGE
        if (entry.entryName.startsWith("media/")) {
          const imageName = path.basename(entry.entryName);
          const imagePath = path.join(MEDIA_DIR, imageName);
          fs.writeFileSync(imagePath, entry.getData());
        }
      }

      // =====================
      // 5. Cleanup file tạm
      // =====================
      fs.unlinkSync(tmpZipPath);
      fs.unlinkSync(req.file.path);

      return {
        status: 200,
        message: "Xử lý DOCX thành công",
        data: {
          json_output: BASE_OUTPUT,
          media_output: MEDIA_DIR,
        },
      };
    });

    return res.status(result.status).json(result);
  }

};

export default MicroserviceController;
