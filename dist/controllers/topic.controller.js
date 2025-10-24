"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topic_service_1 = __importDefault(require("../services/topic.service"));
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
const TopicController = {
    // Lấy toàn bộ topic
    async getAll(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            const topics = await topic_service_1.default.getAll();
            return { status: 200, data: topics, message: 'Danh sách chủ đề' };
        });
        res.status(response.status).json(response);
    },
    // Tạo mới topic
    async create(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            const newTopic = await topic_service_1.default.create(req.body);
            return { status: 201, data: newTopic, message: 'Tạo chủ đề thành công' };
        });
        res.status(response.status).json(response);
    },
    // Cập nhật topic
    async update(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            const updated = await topic_service_1.default.update(id, req.body);
            return { status: 200, data: updated, message: 'Cập nhật chủ đề thành công' };
        });
        if (response.error === 'TOPIC_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy chủ đề để cập nhật';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
    // Xóa topic
    async remove(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            await topic_service_1.default.remove(id);
            return { status: 200, message: 'Xóa chủ đề thành công' };
        });
        if (response.error === 'TOPIC_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy chủ đề để xóa';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
};
exports.default = TopicController;
