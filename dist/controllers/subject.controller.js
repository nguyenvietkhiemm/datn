"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const subject_service_1 = __importDefault(require("../services/subject.service"));
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
const SubjectController = {
    async getAll(req, res) {
        const responses = await (0, safe_execute_1.default)(async () => {
            return {
                status: 200,
                message: "Lấy danh sách môn học thành công",
                data: await subject_service_1.default.getAll()
            };
        });
        res.json(responses);
    },
    async create(req, res) {
        const responses = await (0, safe_execute_1.default)(async () => {
            return {
                status: 201,
                message: "Tạo môn học thành công",
                data: await subject_service_1.default.create(req.body)
            };
        });
        res.json(responses);
    },
    async update(req, res) {
        const responses = await (0, safe_execute_1.default)(async () => {
            return {
                status: 202,
                message: "Cập nhật môn học thành công",
                data: await subject_service_1.default.update(Number(req.params.id), req.body)
            };
        });
        res.json(responses);
    },
    async setAvailable(req, res) {
        const responses = await (0, safe_execute_1.default)(async () => {
            return {
                status: 202,
                message: "Đổi trạng thái môn học thành công",
                data: await subject_service_1.default.setAvailable(Number(req.params.id), Boolean(req.body.available))
            };
        });
        res.json(responses);
    },
    async remove(req, res) {
        const responses = await (0, safe_execute_1.default)(async () => {
            return {
                status: 204,
                message: "Xoá môn học thành công",
                data: await subject_service_1.default.remove(Number(req.params.id))
            };
        });
        res.json(responses);
    },
};
exports.default = SubjectController;
