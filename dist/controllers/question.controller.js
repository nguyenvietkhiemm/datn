"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const question_service_1 = __importDefault(require("../services/question.service"));
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
const QuestionController = {
    // async get(req: Request, res: Response) {
    //   const questions = await QuestionService.get();
    //   res.json(questions);
    // },
    async getAll(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            return {
                status: 200,
                message: "Lấy danh sách câu hỏi thành công",
                data: await question_service_1.default.getAll()
            };
        });
        res.status(response.status).json(response);
    },
    async create(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            const { questions } = req.body;
            const created = await question_service_1.default.create(questions);
            return {
                status: 201,
                message: "Tạo câu hỏi thành công",
                data: created
            };
        });
        res.status(response.status).json(response);
    },
    async update(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            return {
                status: 202,
                message: "Cập nhật câu hỏi thành công",
                data: await question_service_1.default.update(Number(req.params.id), req.body)
            };
        });
        res.status(response.status).json(response);
    },
    async setAvailable(req, res) {
        console.log(req.body);
        const response = await (0, safe_execute_1.default)(async () => {
            return {
                status: 202,
                message: "Đổi trạng thái câu hỏi thành công",
                data: await question_service_1.default.setAvailable(parseInt(req.params.id, 10), Boolean(req.body.available))
            };
        });
        res.status(response.status).json(response);
    },
    async remove(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            return {
                status: 204,
                message: "Xoá câu hỏi thành công",
                data: await question_service_1.default.remove(parseInt(req.params.id, 10))
            };
        });
        res.status(response.status).json(response);
    },
};
exports.default = QuestionController;
