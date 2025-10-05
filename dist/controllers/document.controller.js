"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const document_service_1 = __importDefault(require("../services/document.service"));
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
const DocumentController = {
    async getAll(req, res) {
        const result = await (0, safe_execute_1.default)(async () => {
            return {
                status: 200,
                message: "Lấy danh sách tài liệu thành công",
                data: await document_service_1.default.getAll(),
            };
        });
        return res.status(result.status).json(result);
    },
    async create(req, res) {
        const result = await (0, safe_execute_1.default)(async () => {
            return {
                status: 201,
                message: "Tạo tài liệu thành công",
                data: await document_service_1.default.create(req.body),
            };
        });
        return res.status(result.status).json(result);
    },
    async update(req, res) {
        const result = await (0, safe_execute_1.default)(async () => {
            return {
                status: 202,
                message: "Cập nhật tài liệu thành công",
                data: await document_service_1.default.update(Number(req.params.id), req.body),
            };
        });
        return res.status(result.status).json(result);
    },
    async setAvailable(req, res) {
        const result = await (0, safe_execute_1.default)(async () => {
            return {
                status: 202,
                message: "Đổi trạng thái tài liệu thành công",
                data: await document_service_1.default.setAvailable(Number(req.params.id), Boolean(req.body.available)),
            };
        });
        return res.status(result.status).json(result);
    },
    async remove(req, res) {
        const result = await (0, safe_execute_1.default)(async () => {
            return {
                status: 204,
                message: "Xoá tài liệu thành công",
                data: await document_service_1.default.remove(Number(req.params.id)),
            };
        });
        return res.status(result.status).json(result);
    },
};
exports.default = DocumentController;
