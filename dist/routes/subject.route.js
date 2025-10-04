"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = __importDefault(require("../controllers/subject.controller"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const permission_1 = require("../config/permission");
const subjectRoute = (0, express_1.Router)();
/**
 * @openapi
 * /subjects:
 *   get:
 *     summary: Lấy danh sách môn học
 *     tags:
 *       - Subject
 *     responses:
 *       200:
 *         description: Danh sách môn học
 *       500:
 *         description: Lỗi server
 */
subjectRoute.get('/', subject_controller_1.default.getAll);
/**
 * @openapi
 * /subjects/create:
 *   post:
 *     summary: Tạo môn học mới (yêu cầu admin)
 *     tags:
 *       - Subject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_name:
 *                 type: string
 *                 example: "Vật lý"
 *     responses:
 *       201:
 *         description: Tạo môn học thành công
 *       500:
 *         description: Lỗi server
 */
subjectRoute.post('/create', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), subject_controller_1.default.create);
/**
 * @openapi
 * /subjects/update/{id}:
 *   patch:
 *     summary: Cập nhật thông tin môn học (yêu cầu admin)
 *     tags:
 *       - Subject
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của môn học cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_name:
 *                 type: string
 *                 example: "Toán"
 *     responses:
 *       202:
 *         description: Cập nhật môn học thành công
 *       404:
 *         description: Không tìm thấy môn học
 *       500:
 *         description: Lỗi server
 */
subjectRoute.patch('/update/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), subject_controller_1.default.update);
/**
 * @openapi
 * /subjects/remove/{id}:
 *   delete:
 *     summary: Xóa một subject theo ID (yêu cầu admin)
 *     tags:
 *       - Subject
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của môn học cần xóa
 *     responses:
 *       204:
 *         description: Xóa môn học thành công
 *       404:
 *         description: Không tìm thấy môn học
 *       500:
 *         description: Lỗi server
 */
subjectRoute.delete('/remove/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), subject_controller_1.default.remove);
/**
 * @openapi
 * /subjects/setAvailable/{id}:
 *   patch:
 *     summary: Ẩn một subject theo ID (yêu cầu admin)
 *     tags:
 *       - Subject
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của môn học cần ẩn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               available:
 *                 type: boolean
 *     responses:
 *       204:
 *         description: Xóa môn học thành công
 *       404:
 *         description: Không tìm thấy subject
 *       500:
 *         description: Lỗi server
 */
subjectRoute.patch('/setAvailable/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), subject_controller_1.default.setAvailable);
exports.default = subjectRoute;
