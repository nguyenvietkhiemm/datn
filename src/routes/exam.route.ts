import { Router } from 'express';
import ExamController from '../controllers/exam.controller';
import Authentication from '../middleware/authentication';
import { ADMIN } from "../config/permission";

const examRoute = Router();

/**
 * @openapi
 * /exams/list:
 *   get:
 *     summary: Lấy danh sách đề thi
 *     tags:
 *       - Exam
 *     responses:
 *       200:
 *         description: Danh sách đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.get('/list', ExamController.getAll);

/**
 * @openapi
 * /exams/{id}:
 *   get:
 *     summary: Lấy thông tin đề thi theo ID
 *     tags:
 *       - Exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.get('/:id', ExamController.getById);

/**
 * @openapi
 * /exams/create:
 *   post:
 *     summary: Tạo đề thi mới (yêu cầu admin)
 *     tags:
 *       - Exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Đề thi giữa kỳ"
 *               topic_id:
 *                 type: integer
 *                 example: 1
 *               time_limit:
 *                 type: integer
 *                 example: 60
 *               exam_schedule_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo đề thi thành công
 *       400:
 *         description: Dữ liệu gửi lên không hợp lệ
 *       500:
 *         description: Lỗi server
 */
examRoute.post('/create',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.create);

/**
 * @openapi
 * /exams/update/{id}:
 *   patch:
 *     summary: Cập nhật đề thi (yêu cầu admin)
 *     tags:
 *       - Exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             title:
 *                 type: string
 *                 example: "Đề thi giữa kỳ"
 *               topic_id:
 *                 type: integer
 *                 example: 1
 *               time_limit:
 *                 type: integer
 *                 example: 60
 *               exam_schedule_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       202:
 *         description: Cập nhật đề thi thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.patch('/update/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.update);

/**
 * @openapi
 * /exams/remove/{id}:
 *   delete:
 *     summary: Xóa một đề thi theo ID (yêu cầu admin)
 *     tags:
 *       - Exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi cần xóa
 *     responses:
 *       204:
 *         description: Xóa đề thi thành công
 *       404:
 *         description: Không tìm thấy đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.delete('/remove/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.remove);

/**
 * @openapi
 * /exams/setAvailable/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái đề thi theo ID (yêu cầu admin)
 *     tags:
 *       - Exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đề thi cần thay đổi trạng thái
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             available: false
 *     responses:
 *       204:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Không tìm thấy đề thi
 *       500:
 *         description: Lỗi server
 */
examRoute.patch('/setAvailable/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        ExamController.setAvailable);

export default examRoute;
