import { Router } from "express";
import SubjectController from "../controllers/subject.controller";

const subjectRoute = Router();

/**
 * @openapi
 * /subjects:
 *   get:
 *     summary: Lấy danh sách subject
 *     tags:
 *       - Subject
 *     responses:
 *       200:
 *         description: Danh sách subject
 *       500:
 *         description: Lỗi server
 */
subjectRoute.get('/', SubjectController.getAll);

/**
 * @openapi
 * /subjects/create:
 *   post:
 *     summary: Tạo subject mới
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
 *         description: Tạo subject thành công
 *       500:
 *         description: Lỗi server
 */
subjectRoute.post('/create', SubjectController.create);

/**
 * @openapi
 * /subjects/update:
 *   patch:
 *     summary: Cập nhật thông tin subject
 *     tags:
 *       - Subject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_id:
 *                 type: integer
 *                 example: 1
 *               subject_name:
 *                 type: string
 *                 example: "Toán"
 *     responses:
 *       202:
 *         description: Cập nhật subject thành công
 *       404:
 *         description: Không tìm thấy subject
 *       500:
 *         description: Lỗi server
 */
subjectRoute.patch('/update', SubjectController.update);

/**
 * @openapi
 * /subjects/remove/{subject_id}:
 *   delete:
 *     summary: Xóa một subject theo ID
 *     tags:
 *       - Subject
 *     parameters:
 *       - in: path
 *         name: subject_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của subject cần xóa
 *     responses:
 *       204:
 *         description: Xóa subject thành công
 *       404:
 *         description: Không tìm thấy subject
 *       500:
 *         description: Lỗi server
 */
subjectRoute.delete('/remove/:subject_id', SubjectController.remove);

export default subjectRoute;
