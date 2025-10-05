"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_service_1 = __importDefault(require("../services/role.service"));
const safe_execute_1 = __importDefault(require("../utils/safe.execute"));
const RoleController = {
    async getAll(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            const roles = await role_service_1.default.getAll();
            return { status: 200, data: roles, message: 'Danh sách vai trò' };
        });
        res.status(response.status).json(response);
    },
    async getOne(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            const role = await role_service_1.default.getById(id);
            return { status: 200, data: role, message: 'Lấy vai trò thành công' };
        });
        // nếu service throw 'ROLE_NOT_FOUND', safeExcute sẽ catch và trả 500, cần map thành 404
        if (response.error === 'ROLE_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy vai trò';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
    async create(req, res) {
        const response = await (0, safe_execute_1.default)(async () => {
            const role = await role_service_1.default.create(req.body);
            return {
                status: 201,
                data: role,
                message: 'Tạo vai trò thành công',
            };
        });
        if (response.error === "ROLE_EXISTS") {
            response.status = 400;
            response.message = "Role đã tồn tại";
            delete response.error;
        }
        res.status(response.status).json(response);
    },
    async update(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            const updated = await role_service_1.default.update(id, req.body);
            return { status: 200, data: updated, message: 'Cập nhật vai trò thành công' };
        });
        if (response.error === 'ROLE_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy vai trò để cập nhật';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
    async remove(req, res) {
        const id = Number(req.params.id);
        const response = await (0, safe_execute_1.default)(async () => {
            await role_service_1.default.remove(id);
            return { status: 200, message: 'Xóa vai trò thành công' };
        });
        if (response.error === 'ROLE_NOT_FOUND') {
            response.status = 404;
            response.message = 'Không tìm thấy vai trò để xóa';
            delete response.error;
        }
        res.status(response.status).json(response);
    },
};
exports.default = RoleController;
