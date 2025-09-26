import { Router } from 'express';
import QuestionController from '../controllers/question.controller';

const questionRoute = Router();

/**
 * @openapi
 * /questions:
 *   get:
 *     summary: Lấy danh sách câu hỏi
 *     tags:
 *       - Question
 *     responses:
 *       200:
 *         description: Danh sách câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.get('/', QuestionController.getAll);

/**
 * @openapi
 * /questions/create:
 *   post:
 *     summary: Tạo câu hỏi mới
 *     tags:
 *       - Question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_name:
 *                 type: string
 *                 example: "Định luật II Newton"
 *               question_content:
 *                 type: string
 *                 example: "F = m * a"
 *     responses:
 *       201:
 *         description: Tạo câu hỏi thành công
 *       500:
 *         description: Lỗi server
 */
questionRoute.post('/create', QuestionController.create);

/**
 * @openapi
 * /questions/{id}:
 *   patch:
 *     summary: Cập nhật một phần thông tin câu hỏi
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question_name:
 *                 type: string
 *                 example: "Định luật I Newton"
 *               question_content:
 *                 type: string
 *                 example: "Một vật sẽ đứng yên hoặc chuyển động thẳng đều nếu không chịu tác dụng của lực"
 *     responses:
 *       202:
 *         description: Cập nhật câu hỏi thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.patch('/update', QuestionController.update);

/**
 * @openapi
 * /questions/remove/{question_id}:
 *   delete:
 *     summary: Xóa một câu hỏi theo ID
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: question_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần xóa
 *     responses:
 *       204:
 *         description: Xóa câu hỏi thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.delete('/remove/:question_id', QuestionController.remove);

/**
 * @openapi
 * /questions/remove/{question_id}:
 *   delete:
 *     summary: Xóa một câu hỏi theo ID
 *     tags:
 *       - Question
 *     parameters:
 *       - in: path
 *         name: question_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của câu hỏi cần xóa
 *     responses:
 *       204:
 *         description: Xóa câu hỏi thành công
 *       404:
 *         description: Không tìm thấy câu hỏi
 *       500:
 *         description: Lỗi server
 */
questionRoute.patch('/setAvailable/:question_id', QuestionController.setAvailable);

export default questionRoute;
