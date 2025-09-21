import { Router } from "express";
import UserController from "../controllers/user.controller";
import Authentication from "../middleware/authentication";

const UserRouter = Router();

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
UserRouter.get(
  "/",
  Authentication.AuthenticateToken,
  Authentication.AuthorizeRoles(["2"]), 
  UserController.getAll
);

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
UserRouter.get(
  "/:id",
  Authentication.AuthenticateToken,
  UserController.getOne
);

/**
 * @swagger
 * /users/{id}:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy user
 */
UserRouter.put(
  "/:id",
  Authentication.AuthenticateToken,
  UserController.update // logic check quyền nằm trong controller
);

/**
 * @swagger
 * /users/{id}:
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
UserRouter.delete(
  "/:id",
  Authentication.AuthenticateToken,
  Authentication.AuthorizeRoles(["2"]), // chỉ admin được xóa
  UserController.remove
);

export default UserRouter;
