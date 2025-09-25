import { Router } from 'express';
import DocumentController from '../controllers/document.controller';

const documentRoute = Router();

/**
 * @openapi
 * /documents:
 *   get:
 *     summary: Lấy danh sách tài liệu
 *     tags:
 *       - Document
 *     responses:
 *       200:
 *         description: Danh sách tài liệu
 *       500:
 *         description: Lỗi server
 */
documentRoute.get('/', DocumentController.getAll);

/**
 * @openapi
 * /documents/create:
 *   post:
 *     summary: Tạo tài liệu mới
 *     tags:
 *       - Document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tài liệu Vật lý"
 *               link:
 *                 type: string
 *                 example: "https://example.com/document.pdf"
 *               embedding:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: []
 *               topic_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo tài liệu thành công
 *       500:
 *         description: Lỗi server
 */
documentRoute.post('/create', DocumentController.create);

/**
 * @openapi
 * /documents/update/{document_id}:
 *   patch:
 *     summary: Cập nhật thông tin tài liệu
 *     tags:
 *       - Document
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài liệu cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tài liệu Vật lý cập nhật"
 *               link:
 *                 type: string
 *                 example: "https://example.com/updated.pdf"
 *               embedding:
 *                 type: array
 *                 items:
 *                   type: number
 *                 example: [0.1, 0.2, 0.3]
 *     responses:
 *       202:
 *         description: Cập nhật tài liệu thành công
 */
documentRoute.patch('/update/:document_id', DocumentController.update);

/**
 * @openapi
 * /documents/remove/{document_id}:
 *   delete:
 *     summary: Xóa một tài liệu theo ID
 *     tags:
 *       - Document
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài liệu cần xóa
 *     responses:
 *       204:
 *         description: Xóa tài liệu thành công
 *       404:
 *         description: Không tìm thấy tài liệu
 *       500:
 *         description: Lỗi server
 */
documentRoute.delete('/remove/:document_id', DocumentController.remove);

/**
 * @openapi
 * /documents/set/available/{document_id}:
 *   patch:
 *     summary: Thay đổi trạng thái tài liệu theo ID
 *     tags:
 *       - Document
 *     parameters:
 *       - in: path
 *         name: document_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài liệu cần Thay đổi trạng thái
 *     responses:
 *       204:
 *         description: Thay đổi trạng thái tài liệu thành công
 *       404:
 *         description: Không tìm thấy tài liệu
 *       500:
 *         description: Lỗi server
 */
documentRoute.patch('/setAvailable/:document_id', DocumentController.setAvailable);

export default documentRoute;
