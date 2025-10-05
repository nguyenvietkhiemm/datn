import { Router } from 'express';
import BankController from '../controllers/bank.controller';
import Authentication from '../middleware/authentication';
import { ADMIN } from "../config/permission";
import { BankQuestionController } from '../controllers/bank.question.controller';

const bankRoute = Router();

/**
 * @openapi
 * /bank/list:
 *   get:
 *     summary: Lấy danh sách ngân hàng câu hỏi
 *     tags:
 *       - Bank
 *     responses:
 *       200:
 *         description: Danh sách đề thi
 *       500:
 *         description: Lỗi server
 */
bankRoute.get('/list', BankController.getAll);

/**
 * @openapi
 * /bank/{id}:
 *   get:
 *     summary: Lấy thông tin ngân hàng câu hỏi theo ID
 *     tags:
 *       - Bank
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
bankRoute.get('/:id', BankController.getById);

/**
 * @openapi
 * /bank/create:
 *   post:
 *     summary: Tạo ngân hàng câu hỏi mới (yêu cầu admin)
 *     tags:
 *       - Bank
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Ngân hàng câu hỏi Toán học"
 *               topic_id:
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
bankRoute.post('/create',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        BankController.create);

/**
 * @swagger
 * /question/banks/add/{id}:
 *   post:
 *     summary: Thêm câu hỏi vào ngân hàng câu hỏi (yêu cầu đăng nhập)
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của ngân hàng câu hỏi (bank)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - question_id
 *     responses:
 *       200:
 *         description: Thêm câu hỏi vào ngân hàng câu hỏi thành công
 *       404:
 *         description: Không tìm thấy ngân hàng câu hỏi
 */

bankRoute.post("/banks/add/:id",
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        BankQuestionController.add);

/**
 * @openapi
 * /bank/update/{id}:
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
 *             description: Cập nhật thông tin đề thi
 *                 type: string
 *                 example: "Ngân hàng câu hỏi Toán học nâng cao"
 *               topic_id:
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
bankRoute.patch('/update/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        BankController.update);

/**
 * @openapi
 * /bank/remove/{id}:
 *   delete:
 *     summary: Xóa một ngân hàng câu hỏi theo ID (yêu cầu admin)
 *     tags:
 *       - Bank
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
bankRoute.delete('/remove/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        BankController.remove);

/**
 * @openapi
 * /bank/setAvailable/{id}:
 *   patch:
 *     summary: Thay đổi trạng thái đề thi theo ID (yêu cầu admin)
 *     tags:
 *       - Bank
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
 *         description: Không tìm thấy ngân hàng câu hỏi
 *       500:
 *         description: Lỗi server
 */
bankRoute.patch('/setAvailable/:id',
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        BankController.setAvailable);

/**
 * @swagger
 * /question/banks/remove/{id}:
 *   post:
 *     summary: Xóa câu hỏi khỏi ngân hàng câu hỏi (yêu cầu đăng nhập)
 *     tags: [Banks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của ngân hàng câu hỏi (bank)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - question_id
 *     responses:
 *       200:
 *         description: Xóa câu hỏi khỏi ngân hàng câu hỏi thành công
 *       404:
 *         description: Không tìm thấy ngân hàng câu hỏi
 */
bankRoute.delete("/exams/remove/:id",
        Authentication.AuthenticateToken,
        Authentication.AuthorizeRoles(ADMIN),
        BankQuestionController.remove);

export default bankRoute;
