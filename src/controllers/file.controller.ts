import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { FileService } from "../services/file.service";
import { runBertModel } from "../utils/run.bert";
import path from "path";
import fs from "fs";
import { normalizeImages } from "../utils/helper";

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

    // ===== DOCX =====
    async saveDocx(req: Request, res: Response) {
        const result = await safeExecute(async () => {
            if (!req.file) throw new Error("NO_DOCX_FILE");

            const bertOutput = await runBertModel(req.file.path);

            return {
                status: 200,
                message: "Xử lý DOCX thành công",
                bertOutput,
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

    // ===== IMAGE STREAM =====
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
