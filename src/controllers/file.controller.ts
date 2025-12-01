import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import {runBertModel} from "../utils/run.bert";
import { getCsvFilesList, saveCsvFile, getCsvById, getJsonFilesList, getJsonById, getImagesById } from "../services/file.service";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

export const FileController = {

    // CSV METHODS

    async getAllCsv(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const csvFiles = getCsvFilesList(baseUrl);

            return {
                status: 200,
                message: "Danh sách file CSV trên server",
                data: csvFiles
            }
        })
        return res.status(result.status).json(result)
    },

    async getCsvById(req: Request, res: Response) {
        const result = await safeExecute(async () => {
            const { filename } = req.params;
            const records = getCsvById(filename);
            return {
                status: 200,
                message: `Nội dung CSV ${filename}`,
                data: records,
            };
        });
        return res.status(result.status).json(result);
    },

    async saveCsv(req: Request, res: Response) {
        const result = await safeExecute(async () => {
            const { filename } = req.params;
            const data = req.body;
            console.log("Dữ liệu nhận được để lưu CSV:", data);
            if (!Array.isArray(data)) throw new Error("Dữ liệu phải là mảng object");

            saveCsvFile(filename, data);

            return {
                status: 200,
                message: `Lưu CSV ${filename} thành công!`,
            };
        });
        return res.status(result.status).json(result);
    },

    // JSON FILE HANDLERS

    async getAllJson(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
            const baseUrl = `${req.protocol}://${req.get("host")}`;

            const csvFiles = getJsonFilesList(baseUrl);

            return {
                status: 200,
                message: "Danh sách file CSV trên server",
                data: csvFiles
            }
        })
        return res.status(result.status).json(result)
    },

    async getJsonById(req: Request, res: Response) {
        const result = await safeExecute(async () => {
            const { filename } = req.params;
            const records = getJsonById(filename);
            return {
                status: 200,
                message: `Nội dung JSON ${filename}`,
                data: records,
            };
        });
        return res.status(result.status).json(result);
    },

    async saveJson(req: Request, res: Response) {
        const result = await safeExecute(async () => {
            const { filename } = req.params;
            const data = req.body;
            console.log("Dữ liệu nhận được để lưu CSV:", data);
            if (!Array.isArray(data)) throw new Error("Dữ liệu phải là mảng object");

            saveCsvFile(filename, data);

            return {
                status: 200,
                message: `Lưu CSV ${filename} thành công!`,
            };
        });
        return res.status(result.status).json(result);
    },

    // DOCX FILE HANDLERS

    async saveDocx(req: Request, res: Response) {
        const result = await safeExecute(async () => {
            if (!req.file) {
                throw new Error("Chưa upload file DOCX"); // safeExecute sẽ catch
            }

            const filename = req.file.filename;   // string
            const filePath = req.file.path;   // string

            console.log("File DOCX đã upload:", filename);

            const bertOutput = await runBertModel(filePath);

            console.log("BERT:", bertOutput);

            return {
                status: 200,
                message: `Lưu DOCX ${filename} thành công!`,
                bertOutput,
            };
        });

        // safeExecute trả về object { status, message, ... } luôn
        return res.status(result.status).json(result);
    },

    // IMAGE FILE HANDLERS
    
    async getImagesById(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
            const filesname = req.body.filesname;
            const imageFiles = getImagesById(filesname);

            return {
                status: 200,
                message: "Danh sách file CSV trên server",
                data: imageFiles
            }
        })
        return res.status(result.status).json(result)
    },
}