"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const permission_1 = require("../config/permission");
const userRouter = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách tất cả user (yêu cầu admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Thiếu hoặc sai token
 *       403:
 *         description: Không có quyền
 */
userRouter.get("/", authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), user_controller_1.default.getAll);
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin user theo ID (cần đăng nhập)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy user
 */
userRouter.get("/:id", authentication_1.default.AuthenticateToken, user_controller_1.default.getOne);
/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Cập nhật user (chủ sở hữu hoặc admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của user cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: Khiêm test update
 *               email:
 *                 type: string
 *                 example: "testupdate@example.com"
 *               password_hash:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               role_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy user
 */
userRouter.put("/update/:id", authentication_1.default.AuthenticateToken, user_controller_1.default.update // logic check quyền nằm trong controller
);
/**
 * @swagger
 * /users/remove/{id}:
 *   delete:
 *     summary: Xóa user (chỉ admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy user
 */
userRouter.delete("/remove/:id", authentication_1.default.AuthenticateToken, authentication_1.default.AuthorizeRoles(permission_1.ADMIN), // chỉ admin được xóa
user_controller_1.default.remove);
exports.default = userRouter;
