"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("../services/user.service"));
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
const UserController = {
    // Lấy toàn bộ user
    async getAll(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            const users = await user_service_1.default.getAll();
            return { status: 200, data: users, message: 'Danh sách người dùng' };
        });
        res.status(response.status).json(response);
    },
    // Lấy user theo ID
    async getOne(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            const user = await user_service_1.default.getById(id);
            return { status: 200, data: user, message: 'Lấy thông tin người dùng thành công' };
        });
        if (response.error === 'USER_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy người dùng';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
    // Cập nhật user
    async update(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            const updated = await user_service_1.default.update(id, req.body);
            return { status: 200, data: updated, message: 'Cập nhật người dùng thành công' };
        });
        if (response.error === 'USER_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy người dùng để cập nhật';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
    // Xóa user
    async remove(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            await user_service_1.default.remove(id);
            return { status: 200, message: 'Xóa người dùng thành công' };
        });
        if (response.error === 'USER_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy người dùng để xóa';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
};
exports.default = UserController;
