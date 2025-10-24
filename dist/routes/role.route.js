"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = __importDefault(require("../controllers/role.controller"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const permission_1 = require("../config/permission");
const roleRoute = (0, express_1.Router)();
/**
 * @openapi
 * /roles:
 *   get:
 *     summary: Lấy danh sách tất cả roles (yêu cầu admin)
 *     tags:
 *       - Role
 *     responses:
 *       200:
 *         description: Danh sách role
 *       500:
 *         description : loi
 */
roleRoute.get('/', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), role_controller_1.default.getAll);
/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     summary: Lấy role theo ID (yêu cầu admin)
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Role tìm thấy
 *       404:
 *         description: Không tìm thấy role
 *       500:
 *         description : loi
 */
roleRoute.get('/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), role_controller_1.default.getOne);
/**
 * @openapi
 * /roles/create:
 *   post:
 *     summary: Tạo role mới (yêu cầu admin)
 *     tags:
 *       - Role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - role_name
 *             properties:
 *               role_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role đã được tạo
 *       500:
 *         description : loi
 */
roleRoute.post('/create', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), role_controller_1.default.create);
/**
 * @openapi
 * /roles/update/{id}:
 *   put:
 *     summary: Cập nhật role theo ID (yêu cầu admin)
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *                 example: "Admin"
 *     responses:
 *       202:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy role
 *       500:
 *         description: Lỗi server
 */
roleRoute.put('/update/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), role_controller_1.default.update);
/**
 * @openapi
 * /roles/remove/{id}:
 *   delete:
 *     summary: Xóa role theo ID (yêu cầu admin)
 *     tags:
 *       - Role
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy role
 *       500:
 *         description: Lỗi server
 */
roleRoute.delete('/remove/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), role_controller_1.default.remove);
exports.default = roleRoute;
