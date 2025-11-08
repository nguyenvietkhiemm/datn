import { Request, Response } from "express";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { getCsvFilesList, saveCsvFile } from "../services/file.service";
import path from "path";
import fs from "fs";
import { parse } from "csv-parse/sync";

export const CsvController = {
    async getAll(req: Request, res: Response) {
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

    async getById(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
            const { filename } = req.params;
            const csvDir = path.join(__dirname, "../../data/uploads/csv");

            if (!fs.existsSync(csvDir)) {
                throw new Error("Thư mục CSV không tồn tại");
            }

            const filePath = path.join(csvDir, filename);
            if (!fs.existsSync(filePath)) {
                throw new Error("File không tồn tại");
            }

            const csvText = fs.readFileSync(filePath, "utf-8");
            const records = parse(csvText, {
                columns: true,
                skip_empty_lines: true,
            });

            return {
                status: 200,
                message: `Nội dung CSV ${filename}`,
                data: records,
            };
        });

        return res.status(result.status).json(result);
    },

    async saveCsv(req: Request, res: Response) {
        const result = await safeExecute(async (): Promise<DefaultResponse<any>> => {
            const { filename } = req.params; // tên file CSV
            const csvDir = path.join(__dirname, "../../data/uploads/csv");

            if (!fs.existsSync(csvDir)) {
                fs.mkdirSync(csvDir, { recursive: true });
            }

            // Lấy dữ liệu JSON từ client
            const data = req.body; // nếu dùng Express, body-parser phải được setup

            if (!Array.isArray(data)) {
                throw new Error("Dữ liệu phải là mảng object");
            }

            // Convert object thành CSV string
            const { stringify } = await import("csv-stringify/sync"); // dynamic import
            const csvContent = stringify(data, { header: true });

            // Ghi đè lên file CSV
            const filePath = path.join(csvDir, filename);
            fs.writeFileSync(filePath, csvContent, "utf-8");

            return {
                status: 200,
                message: `Lưu CSV ${filename} thành công!`,
            };
        });

        return res.status(result.status).json(result);
    }
}