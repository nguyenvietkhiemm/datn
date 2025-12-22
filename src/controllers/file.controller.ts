import { Request, Response, NextFunction } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { FileService } from "../services/file.service";
import { runBertModel } from "../utils/run.bert";
import path from "path";
import fs from "fs";
import { normalizeImages } from "../utils/helper";
import { signImage, verifyImage } from "../utils/helper";
export const FileController = {

    // ===== JSON =====
    async getAllJson(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            const files = FileService.getJsonFilesList();

            return {
                status: 200,
                message: "Danh sách file JSON",
                data: files.map((name, index) => ({
                    id: index + 1,
                    name,
                    url: `${baseUrl}/files/json/${name}`,
                })),
            };
        });

        return res.status(result.status).json(result);
    },

    async getJsonById(req: Request, res: Response) {
        const result = await safeExecute(async () => {
            const { filename } = req.params;

            const data = FileService.getJsonById(filename);

            const normalized = Array.isArray(data)
                ? data.map((item: any) => ({
                    ...item,
                    question: {
                        ...item.question,
                        images: normalizeImages(item.question?.images),
                    },
                    answers: Array.isArray(item.answers)
                        ? item.answers.map((ans: any) => ({
                            ...ans,
                            images: normalizeImages(ans.images),
                        }))
                        : [],
                }))
                : data;

            return {
                status: 200,
                message: `Nội dung JSON ${filename}`,
                data: normalized,
            };
        });

        return res.status(result.status).json(result);
    },

    async getImagesInfo(req: Request, res: Response) {
        const result = await safeExecute(
            async (): Promise<DefaultResponse<any>> => {
                const { filenames } = req.body;
                const baseUrl = `${req.protocol}://${req.get("host")}`;

                if (!Array.isArray(filenames)) {
                    return {
                        status: 400,
                        message: "filenames must be an array",
                        data: null,
                    };
                }

                const images = FileService.getImagesInfo(filenames);

                return {
                    status: 200,
                    message: "Danh sách image",
                    data: images.map(img => ({
                        filename: img.filename,
                        url: `${baseUrl}/images/${img.filename}`,
                    })),
                };
            }
        );

        return res.status(result.status).json(result);
    },

    // ===== IMAGE METADATA =====
    async getImagesById(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
            const { filesname } = req.body;
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const images = FileService.getImagesInfo(filesname);

            return {
                status: 200,
                message: "Danh sách image",
                data: images.map(img => ({
                    filename: img.filename,
                    url: `${baseUrl}/files/images/${img.filename}`,
                })),
            };
        });

        return res.status(result.status).json(result);
    },

    async getSignedImageUrl(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
          const { filename } = req.params;
          console.log(filename);
        
          const exp = Math.floor(Date.now() / 1000) + 60 * 70; // 5 phút
          const sig = signImage(filename, exp);
    
          const baseUrl = `${req.protocol}://${req.get("host")}`;
    
          return {
            status: 200,
            message: "Signed image url",
            data: {
              url: `${baseUrl}/file/images/${filename}?exp=${exp}&sig=${sig}`,
            },
          };
        });
    
        return res.status(result.status).json(result);
      },
    
      // ==================================================
      // VERIFY IMAGE SIGNATURE (MIDDLEWARE)
      // ==================================================
      verifyImageSignature(
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        const { filename } = req.params;
        const { exp, sig } = req.query;
    
        if (!exp || !sig) {
          return res.status(401).json({ message: "Missing image signature" });
        }
    
        const isValid = verifyImage(
          filename,
          Number(exp),
          String(sig)
        );
    
        if (!isValid) {
          return res
            .status(403)
            .json({ message: "Invalid or expired image signature" });
        }
    
        next();
      },
    
      async streamImage(req: Request, res: Response) {
        try {
          const { filename } = req.params;
          const { stream, mime } = FileService.getImageStream(filename);
          
          res.setHeader("Content-Type", mime);
          stream.pipe(res);
        } catch (err: any) {
          if (err.message === "IMAGE_NOT_FOUND") {
            return res.status(404).json({ message: "Image not found" });
          }
          return res.status(500).json({ message: "Internal server error" });
        }
      },    

    async uploadImage(req: Request, res: Response) {
        const result = await safeExecute(
            async (): Promise<DefaultResponse<any>> => {
                const file = req.file as any;

                if (!file) {
                    return {
                        status: 400,
                        message: "Image duplicated or not provided",
                        data: null,
                    };
                }

                const uploadDir = path.join(
                    __dirname,
                    "../../data/outputs/media"
                );

                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                const filePath = path.join(uploadDir, file.hashName);

                // lưu file thật sự
                fs.writeFileSync(filePath, file.buffer);

                return {
                    status: 200,
                    message: "Upload image thành công",
                    data: {
                        filename: file.hashName,
                        url: `/images/${file.hashName}`,
                    },
                };
            }
        );

        return res.status(result.status).json(result);
    },
};
