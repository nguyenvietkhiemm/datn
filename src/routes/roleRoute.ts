import { Router } from 'express';
import * as RoleController from '../controllers/roleConteoller';

const roleRoute = Router();

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
 */
roleRoute.get('/', RoleController.getAll);

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
 */
roleRoute.get('/:id', RoleController.getOne);

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
 */
roleRoute.post('/', RoleController.create);

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
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy role
 */
roleRoute.put('/:id', RoleController.update);

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
 */
roleRoute.delete('/:id', RoleController.remove);

export default roleRoute;
