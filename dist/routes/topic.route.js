"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topic_controller_1 = __importDefault(require("../controllers/topic.controller"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const permission_1 = require("../config/permission");
const topicRoute = (0, express_1.Router)();
/**
 * @openapi
 * /topics:
 *   get:
 *     summary: Lấy danh sách tất cả chủ đề (cần đăng nhập)
 *     tags:
 *       - Topic
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách chủ đề
 *       401:
 *         description: Thiếu hoặc sai token
 *       500:
 *         description: Lỗi server
 */
topicRoute.get('/', authentication_1.default.AuthenticateToken, topic_controller_1.default.getAll);
/**
 * @openapi
 * /topics/create:
 *   post:
 *     summary: Tạo chủ đề mới (chỉ admin)
 *     tags:
 *       - Topic
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Chủ đề 1"
 *               description:
 *                 type: string
 *                 example: "Chủ đề về ngữ pháp tiếng Anh"
 *               subject_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Tạo chủ đề thành công
 *       401:
 *         description: Thiếu hoặc sai token
 *       403:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
topicRoute.post('/create', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), // chỉ admin được tạo
topic_controller_1.default.create);
/**
 * @openapi
 * /topics/update/{id}:
 *   patch:
 *     summary: Cập nhật thông tin chủ đề (chỉ admin)
 *     tags:
 *       - Topic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chủ đề cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Chủ đề cập nhật"
 *               description:
 *                 type: string
 *                 example: "Nội dung đã cập nhật"
 *               subject_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       202:
 *         description: Cập nhật chủ đề thành công
 *       401:
 *         description: Thiếu hoặc sai token
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy chủ đề
 *       500:
 *         description: Lỗi server
 */
topicRoute.patch('/update/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), // chỉ admin được sửa
topic_controller_1.default.update);
/**
 * @openapi
 * /topics/remove/{id}:
 *   delete:
 *     summary: Xóa một chủ đề theo ID (chỉ admin)
 *     tags:
 *       - Topic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chủ đề cần xóa
 *     responses:
 *       204:
 *         description: Xóa chủ đề thành công
 *       401:
 *         description: Thiếu hoặc sai token
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy chủ đề
 *       500:
 *         description: Lỗi server
 */
topicRoute.delete('/remove/:id', authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), // chỉ admin được xóa
topic_controller_1.default.remove);
exports.default = topicRoute;
