import DocumentService from "../services/document.service";
import safeExecute, { DefaultResponse } from "../utils/safe.execute";
import { Request, Response } from "express";

const DocumentController = {
    async getAll(req: Request, res: Response) {
        const responses: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 200,
                message: "Lấy danh sách tài liệu thành công",
                data: await DocumentService.getAll()
            } as DefaultResponse<any>;
        });
        res.json(responses);
    },

    async create(req: Request, res: Response) {
        const responses: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 201,
                message: "Tạo tài liệu thành công",
                data: await DocumentService.create(req.body)
            } as DefaultResponse<any>;
        });
        res.json(responses);
    },

    async update(req: Request, res: Response) {
        const responses: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 202,
                message: "Cập nhật tài liệu thành công",
                data: await DocumentService.update(req.body)
            } as DefaultResponse<any>;
        });
        res.json(responses);
    },

    async remove(req: Request, res: Response) {
        const responses: DefaultResponse<any> = await safeExecute(async () => {
            return {
                status: 204,
                message: "Xoá tài liệu thành công",
                data: await DocumentService.remove(parseInt(req.params.document_id, 10))
            } as DefaultResponse<any>;
        });
        res.json(responses);
    },
}

export default DocumentController;