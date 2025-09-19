import { Router } from 'express';
import RoleController from '../controllers/role.controller';

const RoleRoute = Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     summary: Lấy danh sách tất cả roles
 *     tags:
 *       - Role
 *     responses:
 *       200:
 *         description: Danh sách role
 *       500:
 *         description : loi
 */
RoleRoute.get('/', RoleController.getAll);

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     summary: Lấy role theo ID
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
RoleRoute.get('/:id', RoleController.getOne);

/**
 * @openapi
 * /roles:
 *   post:
 *     summary: Tạo role mới
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
 *               role_id:
 *                 type: integer
 *               role_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Role đã được tạo
 *       500:
 *         description : loi
 */
RoleRoute.post('/', RoleController.create);

/**
 * @openapi
 * /roles/{id}:
 *   put:
 *     summary: Cập nhật role theo ID
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
 *     responses:
 *       202:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy role
 *       500:
 *         description : loi
 */
RoleRoute.put('/:id', RoleController.update);

/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     summary: Xóa role theo ID
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
 *         description : loi
 */
RoleRoute.delete('/:id', RoleController.remove);

export default RoleRoute;
