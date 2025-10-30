import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { Request, Response } from "express";
import BankService from "../services/bank.service";

const BankController = {
    async getAll(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 200,
                message: "Lấy danh sách ngân hàng câu hỏi thành công",
                data: await BankService.getAll(),
            };
        });
        return res.status(result.status).json(result);
    },

    async getById(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 200,
                message: "Lấy ngân hàng câu hỏi theo ID thành công",
                data: await BankService.getById(Number(req.params.id)),
            };
        });
        return res.status(result.status).json(result);
    },

    async create(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 201,
                message: "Tạo ngân hàng câu hỏi thành công",
                data: await BankService.create(req.body),
            };
        });
        return res.status(result.status).json(result);
    },

    async update(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 202,
                message: "Cập nhật ngân hàng câu hỏi thành công",
                data: await BankService.update(Number(req.params.id), req.body),
            };
        });
        return res.status(result.status).json(result);
    },

    async setAvailable(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 202,
                message: "Đổi trạng thái ngân hàng câu hỏi thành công",
                data: await BankService.setAvailable(
                    Number(req.params.id),
                    Boolean(req.body.available)
                ),
            };
        });
        return res.status(result.status).json(result);
    },

    async remove(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 204,
                message: "Xoá ngân hàng câu hỏi thành công",
                data: await BankService.remove(Number(req.params.id)),
            };
        });
        return res.status(result.status).json(result);
    },

    async search(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 200,
                message: "Lấy danh sách ngân hàng câu hỏi thành công",
                data: await BankService.search(String(req.query.searchValue), Number(req.query.page)),
            };
        });

        return res.status(result.status).json(result);
    },

    async filter(req: Request, res: Response) {
        const result: DefaultResponse<any> = await safeExecute(async () => {
            const topicParam = req.query.topic;
            const status = String(req.query.status);
            const page = Number(req.query.page);

            let topicIds: number[] = [];

            if (typeof topicParam === "string" && topicParam.length > 0) {
                topicIds = topicParam.split(",").map(Number);
            }

            return {
                status: 200,
                message: "Lọc ngân hàng câu hỏi thành công",
                data: await BankService.filter(topicIds, status, page)
            };
        });

        return res.status(result.status).json(result);
    },
};

export default BankController;